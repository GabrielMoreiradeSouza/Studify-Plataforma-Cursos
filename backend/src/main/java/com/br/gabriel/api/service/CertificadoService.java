package com.br.gabriel.api.service;

import com.br.gabriel.api.dto.response.CertificadoResponse;
import com.br.gabriel.api.entity.Certificado;
import com.br.gabriel.api.entity.Curso;
import com.br.gabriel.api.entity.Trilha;
import com.br.gabriel.api.entity.Usuario;
import com.br.gabriel.api.exception.ResourceNotFoundException;
import com.br.gabriel.api.repository.CertificadoRepository;
import com.br.gabriel.api.repository.CursoRepository;
import com.br.gabriel.api.repository.TrilhaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
public class CertificadoService {

    private final CertificadoRepository certificadoRepository;
    private final CursoRepository cursoRepository;
    private final TrilhaRepository trilhaRepository;

    public CertificadoService(CertificadoRepository certificadoRepository, CursoRepository cursoRepository, TrilhaRepository trilhaRepository) {
        this.certificadoRepository = certificadoRepository;
        this.cursoRepository = cursoRepository;
        this.trilhaRepository = trilhaRepository;
    }

    @Transactional
    public CertificadoResponse emitirCertificadoCurso(Usuario usuario, UUID cursoId) {
        if (certificadoRepository.existsByUsuario_IdUsuarioAndCurso_IdCursoAndTrilhaIsNull(usuario.getIdUsuario(), cursoId)) {
            throw new RuntimeException("Certificado já emitido para este curso");
        }

        Curso curso = cursoRepository.findById(cursoId)
                .orElseThrow(() -> new ResourceNotFoundException("Curso nao encontrado"));

        Certificado c = new Certificado();
        c.setUsuario(usuario);
        c.setCurso(curso);
        c.setCodigoVerificacao(gerarCodigo(usuario.getIdUsuario(), cursoId));
        c.setDataEmissao(LocalDate.now());
        c = certificadoRepository.save(c);

        return toResponse(c);
    }

    @Transactional
    public CertificadoResponse emitirCertificadoTrilha(Usuario usuario, UUID trilhaId) {
        if (certificadoRepository.existsByUsuario_IdUsuarioAndTrilha_IdTrilha(usuario.getIdUsuario(), trilhaId)) {
            throw new RuntimeException("Certificado já emitido para esta trilha");
        }

        Trilha trilha = trilhaRepository.findById(trilhaId)
                .orElseThrow(() -> new ResourceNotFoundException("Trilha nao encontrada"));

        Certificado c = new Certificado();
        c.setUsuario(usuario);
        c.setTrilha(trilha);
        c.setCodigoVerificacao(gerarCodigo(usuario.getIdUsuario(), trilhaId));
        c.setDataEmissao(LocalDate.now());
        c = certificadoRepository.save(c);

        return toResponse(c);
    }

    public List<CertificadoResponse> listarCertificados(Usuario usuario) {
        return certificadoRepository.findByUsuario_IdUsuarioOrderByDataEmissaoDesc(usuario.getIdUsuario())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public CertificadoResponse buscarPorId(UUID id) {
        Certificado c = certificadoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Certificado nao encontrado"));
        return toResponse(c);
    }

    public String gerarHtmlCertificado(CertificadoResponse dto) {
        String tipo = dto.nomeTrilha() != null ? "Trilha" : "Curso";
        String nome = dto.nomeTrilha() != null ? dto.nomeTrilha() : dto.nomeCurso();

        return """
            <!DOCTYPE html>
            <html lang="pt-BR">
            <head>
                <meta charset="UTF-8">
                <title>Certificado - Studify</title>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body {
                        font-family: 'Georgia', 'Times New Roman', serif;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        min-height: 100vh;
                        background: #f0f0f0;
                        padding: 20px;
                    }
                    .certificate {
                        width: 794px;
                        min-height: 560px;
                        background: #fff;
                        border: 8px solid #1a1a2e;
                        padding: 50px;
                        text-align: center;
                        position: relative;
                        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
                    }
                    .certificate:before {
                        content: '';
                        position: absolute;
                        top: 10px;
                        left: 10px;
                        right: 10px;
                        bottom: 10px;
                        border: 2px solid #295bf1;
                        pointer-events: none;
                    }
                    .logo {
                        font-size: 36px;
                        font-weight: bold;
                        color: #295bf1;
                        font-family: 'Arial', sans-serif;
                        margin-bottom: 30px;
                    }
                    h1 {
                        font-size: 28px;
                        color: #1a1a2e;
                        margin-bottom: 10px;
                        text-transform: uppercase;
                        letter-spacing: 2px;
                    }
                    .subtitle {
                        font-size: 16px;
                        color: #666;
                        margin-bottom: 30px;
                    }
                    .statement {
                        font-size: 18px;
                        color: #333;
                        line-height: 1.8;
                        margin-bottom: 10px;
                    }
                    .student-name {
                        font-size: 36px;
                        font-weight: bold;
                        color: #1a1a2e;
                        margin: 15px 0;
                        text-transform: uppercase;
                        letter-spacing: 1px;
                    }
                    .course-name {
                        font-size: 22px;
                        font-weight: bold;
                        color: #295bf1;
                        margin: 10px 0 20px;
                    }
                    .code {
                        font-size: 11px;
                        color: #999;
                        margin-top: 10px;
                        font-family: monospace;
                    }
                    @media print {
                        body { background: #fff; padding: 0; }
                        .certificate { box-shadow: none; border: 8px solid #1a1a2e; }
                    }
                </style>
            </head>
            <body>
                <div class="certificate">
                    <div class="logo">STUDIFY</div>
                    <h1>Certificado</h1>
                    <p class="subtitle">Certificamos que</p>
                    <p class="student-name">%s</p>
                    <p class="statement">concluiu o <strong>%s</strong> com sucesso!</p>
                    <p class="course-name">%s</p>
                    <p class="code">Código de verificação: %s</p>
                </div>
            </body>
            </html>
            """.formatted(
                    dto.nomeUsuario(),
                    tipo,
                    nome,
                    dto.codigoVerificacao()
            );
    }

    private CertificadoResponse toResponse(Certificado c) {
        return new CertificadoResponse(
                c.getIdCertificado(),
                c.getUsuario().getIdUsuario(),
                c.getUsuario().getNomeCompleto(),
                c.getCurso() != null ? c.getCurso().getIdCurso() : null,
                c.getCurso() != null ? c.getCurso().getTitulo() : null,
                c.getTrilha() != null ? c.getTrilha().getIdTrilha() : null,
                c.getTrilha() != null ? c.getTrilha().getTitulo() : null,
                c.getCodigoVerificacao(),
                c.getDataEmissao()
        );
    }

    private String gerarCodigo(UUID idUsuario, UUID idEntidade) {
        String raw = idUsuario.toString() + "-" + idEntidade.toString() + "-" + System.currentTimeMillis();
        return "STD-" + Integer.toHexString(raw.hashCode()).toUpperCase();
    }
}
