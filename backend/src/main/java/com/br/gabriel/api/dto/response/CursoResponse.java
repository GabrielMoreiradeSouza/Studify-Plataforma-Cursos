package com.br.gabriel.api.dto.response;

import java.time.LocalDate;
import java.util.UUID;

public record CursoResponse(
        UUID idCurso,
        String titulo,
        String descricao,
        UUID idInstrutor,
        String nomeInstrutor,
        UUID idCategoria,
        String nomeCategoria,
        String nivel,
        LocalDate dataPublicacao,
        Integer totalAulas,
        Integer totalHoras,
        String imagemKey
) {
}
