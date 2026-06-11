package com.br.gabriel.api.service;

import com.br.gabriel.api.dto.response.ProgressoResponse;
import com.br.gabriel.api.entity.Curso;
import com.br.gabriel.api.entity.Lesson;
import com.br.gabriel.api.entity.Progresso;
import com.br.gabriel.api.entity.Trilha;
import com.br.gabriel.api.entity.TrilhaProgresso;
import com.br.gabriel.api.entity.Usuario;
import com.br.gabriel.api.exception.ResourceNotFoundException;
import com.br.gabriel.api.repository.CursoRepository;
import com.br.gabriel.api.repository.LessonRepository;
import com.br.gabriel.api.repository.ProgressoRepository;
import com.br.gabriel.api.repository.TrilhaProgressoRepository;
import com.br.gabriel.api.repository.TrilhaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class ProgressoService {

    private final ProgressoRepository progressoRepository;
    private final LessonRepository lessonRepository;
    private final TrilhaProgressoRepository trilhaProgressoRepository;
    private final TrilhaRepository trilhaRepository;
    private final CursoRepository cursoRepository;
    private final GamificacaoService gamificacaoService;

    public ProgressoService(ProgressoRepository progressoRepository, LessonRepository lessonRepository, TrilhaProgressoRepository trilhaProgressoRepository, TrilhaRepository trilhaRepository, CursoRepository cursoRepository, GamificacaoService gamificacaoService) {
        this.progressoRepository = progressoRepository;
        this.lessonRepository = lessonRepository;
        this.trilhaProgressoRepository = trilhaProgressoRepository;
        this.trilhaRepository = trilhaRepository;
        this.cursoRepository = cursoRepository;
        this.gamificacaoService = gamificacaoService;
    }

    @Transactional
    public ProgressoResponse marcarCompleta(UUID lessonId, Usuario usuario) {
        return marcarCompleta(lessonId, usuario, null);
    }

    @Transactional
    public ProgressoResponse marcarCompleta(UUID lessonId, Usuario usuario, UUID trilhaId) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new ResourceNotFoundException("Aula não encontrada"));

        Progresso progresso = progressoRepository
                .findByUsuario_IdUsuarioAndLesson_IdLesson(usuario.getIdUsuario(), lessonId)
                .orElseGet(() -> {
                    Progresso p = new Progresso();
                    p.setUsuario(usuario);
                    p.setLesson(lesson);
                    return p;
                });

        boolean jaCompleto = progresso.getCompletado() != null && progresso.getCompletado();

        progresso.setCompletado(true);
        progresso.setDataConclusao(LocalDateTime.now());
        progresso = progressoRepository.save(progresso);

        if (!jaCompleto) {
            UUID cursoId = lesson.getCurso().getIdCurso();
            gamificacaoService.processarConclusaoCurso(usuario, cursoId);

            if (trilhaId != null) {
                processarProgressoTrilha(usuario, trilhaId, cursoId);
            }
        }

        return toResponse(progresso);
    }

    private void processarProgressoTrilha(Usuario usuario, UUID trilhaId, UUID cursoId) {
        TrilhaProgresso tp = trilhaProgressoRepository
                .findByUsuario_IdUsuarioAndTrilha_IdTrilhaAndCurso_IdCurso(usuario.getIdUsuario(), trilhaId, cursoId)
                .orElseGet(() -> {
                    TrilhaProgresso t = new TrilhaProgresso();
                    t.setUsuario(usuario);
                    Trilha trilha = trilhaRepository.findById(trilhaId)
                            .orElseThrow(() -> new ResourceNotFoundException("Trilha nao encontrada"));
                    Curso curso = cursoRepository.findById(cursoId)
                            .orElseThrow(() -> new ResourceNotFoundException("Curso nao encontrado"));
                    t.setTrilha(trilha);
                    t.setCurso(curso);
                    return t;
                });

        if (tp.getCompletado() != null && tp.getCompletado()) return;

        tp.setCompletado(true);
        tp.setDataConclusao(LocalDate.now());
        trilhaProgressoRepository.save(tp);
    }

    public List<ProgressoResponse> listarProgresso(UUID cursoId, Usuario usuario) {
        return progressoRepository
                .findByUsuario_IdUsuarioAndLesson_Curso_IdCurso(usuario.getIdUsuario(), cursoId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private ProgressoResponse toResponse(Progresso p) {
        return new ProgressoResponse(
                p.getIdProgresso(),
                p.getLesson().getIdLesson(),
                p.getCompletado(),
                p.getDataConclusao()
        );
    }
}
