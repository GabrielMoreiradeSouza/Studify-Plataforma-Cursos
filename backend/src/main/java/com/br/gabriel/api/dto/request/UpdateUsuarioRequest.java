package com.br.gabriel.api.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpdateUsuarioRequest(
        @NotBlank String nomeCompleto,
        @Email @NotBlank String email,
        @NotBlank @Size(min = 6, max = 255) String senhaHash
) {}
