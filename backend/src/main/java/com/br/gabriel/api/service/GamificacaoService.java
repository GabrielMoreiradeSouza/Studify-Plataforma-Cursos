package com.br.gabriel.api.service;

import com.br.gabriel.api.dto.response.ConquistaResponse;
import com.br.gabriel.api.dto.response.PerfilResponse;
import com.br.gabriel.api.entity.*;
import com.br.gabriel.api.exception.ResourceNotFoundException;
import com.br.gabriel.api.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class GamificacaoService {

    private static final int PONTOS_POR_CURSO = 25;
    private static final int PONTOS_POR_NIVEL = 50;

    private static final UUID CONQUISTA_PRIMEIRO_CURSO = UUID.fromString("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa");
    private static final UUID CONQUISTA_PRIMEIRA_TRILHA = UUID.fromString("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb");

    private final UsuarioRepository usuarioRepository;
    private final ConquistaRepository conquistaRepository;
    private final UsuarioConquistaRepository usuarioConquistaRepository;
    private final ProgressoRepository progressoRepository;
    private final LessonRepository lessonRepository;
    private final TrilhaCursoRepository trilhaCursoRepository;
    private final TrilhaRepository trilhaRepository;
    private final TrilhaProgressoRepository trilhaProgressoRepository;
    private final CertificadoService certificadoService;

    public GamificacaoService(
            UsuarioRepository usuarioRepository,
            ConquistaRepository conquistaRepository,
            UsuarioConquistaRepository usuarioConquistaRepository,
            ProgressoRepository progressoRepository,
            LessonRepository lessonRepository,
            TrilhaCursoRepository trilhaCursoRepository,
            TrilhaRepository trilhaRepository,
            TrilhaProgressoRepository trilhaProgressoRepository,
            CertificadoService certificadoService) {
        this.usuarioRepository = usuarioRepository;
        this.conquistaRepository = conquistaRepository;
        this.usuarioConquistaRepository = usuarioConquistaRepository;
        this.progressoRepository = progressoRepository;
        this.lessonRepository = lessonRepository;
        this.trilhaCursoRepository = trilhaCursoRepository;
        this.trilhaRepository = trilhaRepository;
        this.trilhaProgressoRepository = trilhaProgressoRepository;
        this.certificadoService = certificadoService;
    }

    public PerfilResponse getPerfil(Usuario usuario) {
        List<ConquistaResponse> conquistas = listarConquistas(usuario);
        return new PerfilResponse(
                usuario.getIdUsuario(),
                usuario.getNomeCompleto(),
                usuario.getEmail(),
                usuario.getPontos(),
                usuario.getNivel(),
                conquistas
        );
    }

    public List<ConquistaResponse> listarConquistas(Usuario usuario) {
        List<Conquista> todas = conquistaRepository.findAll();
        return todas.stream().map(c -> {
            boolean desbloqueada = usuarioConquistaRepository
                    .existsByUsuario_IdUsuarioAndConquista_IdConquista(usuario.getIdUsuario(), c.getIdConquista());
            LocalDateTime data = null;
            if (desbloqueada) {
                data = usuarioConquistaRepository
                        .findByUsuario_IdUsuarioAndConquista_IdConquista(usuario.getIdUsuario(), c.getIdConquista())
                        .map(UsuarioConquista::getDataConquista)
                        .orElse(null);
            }
            return new ConquistaResponse(c.getIdConquista(), c.getNome(), c.getDescricao(), desbloqueada, data);
        }).toList();
    }

    @Transactional
    public void processarConclusaoCurso(Usuario usuario, UUID cursoId) {
        Usuario managed = usuarioRepository.findById(usuario.getIdUsuario())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario nao encontrado"));

        long totalLessons = lessonRepository.findByCurso_IdCursoOrderByOrdemAsc(cursoId).size();
        if (totalLessons == 0) return;

        long concluidas = progressoRepository
                .countByLesson_Curso_IdCursoAndCompletadoTrueAndUsuario_IdUsuario(cursoId, usuario.getIdUsuario());

        if (concluidas < totalLessons) return;

        managed.setPontos(managed.getPontos() + PONTOS_POR_CURSO);
        managed.setNivel(calcularNivel(managed.getPontos()));
        usuarioRepository.save(managed);

        verificarConquistaPrimeiroCurso(managed);
        emitirCertificadoCurso(managed, cursoId);
        verificarConquistaPrimeiraTrilha(managed);
    }

    public boolean isCursoCompleto(Usuario usuario, UUID cursoId) {
        long totalLessons = lessonRepository.findByCurso_IdCursoOrderByOrdemAsc(cursoId).size();
        if (totalLessons == 0) return false;
        long concluidas = progressoRepository
                .countByLesson_Curso_IdCursoAndCompletadoTrueAndUsuario_IdUsuario(cursoId, usuario.getIdUsuario());
        return concluidas >= totalLessons;
    }

    private void verificarConquistaPrimeiroCurso(Usuario usuario) {
        if (usuarioConquistaRepository.existsByUsuario_IdUsuarioAndConquista_IdConquista(
                usuario.getIdUsuario(), CONQUISTA_PRIMEIRO_CURSO)) {
            return;
        }

        long cursosCompletos = contarCursosCompletos(usuario);
        if (cursosCompletos >= 1) {
            concederConquista(usuario, CONQUISTA_PRIMEIRO_CURSO);
        }
    }

    private void verificarConquistaPrimeiraTrilha(Usuario usuario) {
        List<Trilha> trilhas = trilhaRepository.findAll();
        for (Trilha trilha : trilhas) {
            List<TrilhaCurso> cursos = trilhaCursoRepository.findByIdIdTrilhaOrderByOrdemAsc(trilha.getIdTrilha());
            if (cursos.isEmpty()) continue;

            if (isTrilhaCompleta(usuario, trilha.getIdTrilha())) {
                if (!usuarioConquistaRepository.existsByUsuario_IdUsuarioAndConquista_IdConquista(
                        usuario.getIdUsuario(), CONQUISTA_PRIMEIRA_TRILHA)) {
                    concederConquista(usuario, CONQUISTA_PRIMEIRA_TRILHA);
                }
                emitirCertificadoTrilha(usuario, trilha.getIdTrilha());
                return;
            }
        }
    }

    private long contarCursosCompletos(Usuario usuario) {
        List<UUID> cursosIds = progressoRepository.findDistinctCursoIdsByUsuario(usuario.getIdUsuario());
        return cursosIds.stream().filter(id -> isCursoCompleto(usuario, id)).count();
    }

    private void concederConquista(Usuario usuario, UUID conquistaId) {
        Conquista conquista = conquistaRepository.findById(conquistaId).orElse(null);
        if (conquista == null) return;

        UsuarioConquista uc = new UsuarioConquista();
        uc.setUsuario(usuario);
        uc.setConquista(conquista);
        uc.setDataConquista(LocalDateTime.now());
        usuarioConquistaRepository.save(uc);
    }

    private void emitirCertificadoCurso(Usuario usuario, UUID cursoId) {
        try {
            certificadoService.emitirCertificadoCurso(usuario, cursoId);
        } catch (RuntimeException e) {
            // Certificado ja emitido ou erro - apenas ignora
        }
    }

    private void emitirCertificadoTrilha(Usuario usuario, UUID trilhaId) {
        try {
            certificadoService.emitirCertificadoTrilha(usuario, trilhaId);
        } catch (RuntimeException e) {
            // Certificado ja emitido ou erro - apenas ignora
        }
    }

    private boolean isTrilhaCompleta(Usuario usuario, UUID trilhaId) {
        long totalCursos = trilhaCursoRepository.findByIdIdTrilhaOrderByOrdemAsc(trilhaId).size();
        if (totalCursos == 0) return false;
        long concluidos = trilhaProgressoRepository
                .countByUsuario_IdUsuarioAndTrilha_IdTrilhaAndCompletadoTrue(usuario.getIdUsuario(), trilhaId);
        return concluidos >= totalCursos;
    }

    private Integer calcularNivel(Integer pontos) {
        return (pontos / PONTOS_POR_NIVEL) + 1;
    }
}
