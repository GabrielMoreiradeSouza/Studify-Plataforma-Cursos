package com.br.gabriel.api.dto.response;

import java.math.BigDecimal;
import java.util.UUID;

public record CarteiraResponse(
        UUID idUsuario,
        BigDecimal saldo
) {
}
