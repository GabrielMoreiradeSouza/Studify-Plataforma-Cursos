package com.br.gabriel.api.controller;

import com.br.gabriel.api.dto.response.ConquistaResponse;
import com.br.gabriel.api.dto.response.PerfilResponse;
import com.br.gabriel.api.security.AuthenticatedUsers;
import com.br.gabriel.api.service.GamificacaoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/gamificacao")
@Tag(name = "Gamificação", description = "Endpoints de gamificação (nível, pontos, conquistas)")
public class GamificacaoController {

    private final GamificacaoService gamificacaoService;

    public GamificacaoController(GamificacaoService gamificacaoService) {
        this.gamificacaoService = gamificacaoService;
    }

    @GetMapping("/perfil")
    @Operation(summary = "Obter perfil do usuário com nível, pontos e conquistas")
    public ResponseEntity<PerfilResponse> getPerfil(
            @AuthenticationPrincipal AuthenticatedUsers authenticated) {
        return ResponseEntity.ok(gamificacaoService.getPerfil(authenticated.usuario()));
    }

    @GetMapping("/conquistas")
    @Operation(summary = "Listar todas as conquistas e status do usuário")
    public ResponseEntity<List<ConquistaResponse>> listarConquistas(
            @AuthenticationPrincipal AuthenticatedUsers authenticated) {
        return ResponseEntity.ok(gamificacaoService.listarConquistas(authenticated.usuario()));
    }
}
