package com.br.gabriel.api.dto.response;

import java.math.BigDecimal;
import java.util.UUID;

public record PlanoResponse(
        UUID idPlano,
        String nome,
        String descricao,
        BigDecimal preco,
        Integer duracaoMeses
) {
}
