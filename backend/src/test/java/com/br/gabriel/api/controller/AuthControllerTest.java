package com.br.gabriel.api.controller;

import com.br.gabriel.api.dto.request.RegisterRequest;
import com.br.gabriel.api.dto.response.SignInResponse;
import com.br.gabriel.api.service.AuthService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class AuthControllerTest {

    @Mock
    private AuthService authService;

    @InjectMocks
    private AuthController authController;

    @Test
    public void deveRegistrarUsuarioComSucesso() {
        RegisterRequest request = new RegisterRequest("Teste Usuario", "teste@email.com", "senha123");
        SignInResponse responseMock = new SignInResponse("token_valido", "Teste Usuario", "teste@email.com", UUID.randomUUID());

        when(authService.register(any(RegisterRequest.class))).thenReturn(responseMock);

        ResponseEntity<SignInResponse> responseEntity = authController.register(request);

        assertEquals(HttpStatus.CREATED, responseEntity.getStatusCode());
        assertEquals("token_valido", responseEntity.getBody().token());
        assertEquals("Teste Usuario", responseEntity.getBody().nomeCompleto());
        assertEquals("teste@email.com", responseEntity.getBody().email());
    }
}

