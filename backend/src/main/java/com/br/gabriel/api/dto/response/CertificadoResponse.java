package com.br.gabriel.api.dto.response;

import java.time.LocalDate;
import java.util.UUID;

public record CertificadoResponse(
        UUID idCertificado,
        UUID idUsuario,
        String nomeUsuario,
        UUID idCurso,
        String nomeCurso,
        UUID idTrilha,
        String nomeTrilha,
        String codigoVerificacao,
        LocalDate dataEmissao
) {
}
