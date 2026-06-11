package com.br.gabriel.api.dto.response;

import java.util.List;
import java.util.UUID;

public record PerfilResponse(
        UUID idUsuario,
        String nomeCompleto,
        String email,
        Integer pontos,
        Integer nivel,
        List<ConquistaResponse> conquistas
) {}
