package com.br.gabriel.api.dto.response;

import java.time.LocalDateTime;
import java.util.UUID;

public record ConquistaResponse(
        UUID idConquista,
        String nome,
        String descricao,
        boolean desbloqueada,
        LocalDateTime dataConquista
) {}
