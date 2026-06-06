package com.br.gabriel.api.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record SignInRequest(@Email @NotBlank String email, @NotBlank String senhaHash) {
}
