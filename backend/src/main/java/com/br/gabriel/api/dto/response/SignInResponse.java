package com.br.gabriel.api.dto.response;


import java.util.UUID;

public record SignInResponse(
        String token,
        String nomeCompleto,
        String email,
        UUID idUsuario
){

}

