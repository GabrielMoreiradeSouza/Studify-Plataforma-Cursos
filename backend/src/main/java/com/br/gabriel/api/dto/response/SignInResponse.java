package com.br.gabriel.api.dto.response;


import com.br.gabriel.api.entity.UsuarioRole;

import java.util.UUID;

public record SignInResponse(
        String token,
        String nomeCompleto,
        String email,
        UUID idUsuario,
        UsuarioRole role
){

}

