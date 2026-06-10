package com.br.gabriel.api.dto.response;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public record TrilhaResponse(
        UUID idTrilha,
        String titulo,
        String descricao,
        LocalDate dataCriacao,
        Integer totalCursos,
        String imagemKey,
        UUID idCategoria,
        String nomeCategoria,
        List<CursoResponse> cursos
) {
}
