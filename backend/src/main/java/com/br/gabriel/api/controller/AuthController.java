package com.br.gabriel.api.controller;

import com.br.gabriel.api.dto.request.RegisterRequest;
import com.br.gabriel.api.dto.request.SignInRequest;
import com.br.gabriel.api.dto.response.SignInResponse;
import com.br.gabriel.api.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Tag(name = "Autenticação", description = "Endpoints de autenticação")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    @Operation(summary = "Cadastro de usuário")
    public ResponseEntity<SignInResponse> register(@Valid @RequestBody RegisterRequest body) {
        SignInResponse response = authService.register(body);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/sign-in")
    @Operation(summary = "Login de usuário")
    public ResponseEntity<SignInResponse> signIn(@Valid @RequestBody SignInRequest body) {
        return ResponseEntity.ok(authService.signIn(body));
    }
}
