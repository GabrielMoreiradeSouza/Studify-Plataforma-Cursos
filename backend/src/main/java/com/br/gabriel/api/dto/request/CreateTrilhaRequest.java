package com.br.gabriel.api.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record CreateTrilhaRequest(
        @NotBlank String titulo,
        String descricao,
        @NotNull UUID categoriaId
) {
}
