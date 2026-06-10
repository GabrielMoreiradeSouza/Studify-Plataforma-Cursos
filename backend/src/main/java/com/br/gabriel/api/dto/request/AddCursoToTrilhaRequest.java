package com.br.gabriel.api.dto.request;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record AddCursoToTrilhaRequest(
        @NotNull UUID cursoId,
        Integer ordem
) {
}
