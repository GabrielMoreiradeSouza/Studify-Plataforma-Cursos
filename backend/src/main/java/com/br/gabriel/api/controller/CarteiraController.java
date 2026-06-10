package com.br.gabriel.api.controller;

import com.br.gabriel.api.dto.response.CarteiraResponse;
import com.br.gabriel.api.security.AuthenticatedUsers;
import com.br.gabriel.api.service.AssinaturaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/carteira")
@Tag(name = "Carteira", description = "Endpoints da carteira virtual")
public class CarteiraController {

    private final AssinaturaService assinaturaService;

    public CarteiraController(AssinaturaService assinaturaService) {
        this.assinaturaService = assinaturaService;
    }

    @GetMapping("/saldo")
    @Operation(summary = "Obter saldo da carteira")
    public ResponseEntity<CarteiraResponse> getSaldo(
            @AuthenticationPrincipal AuthenticatedUsers authenticated) {
        return ResponseEntity.ok(assinaturaService.getSaldo(authenticated.usuario()));
    }

    @PostMapping("/comprar-plano")
    @Operation(summary = "Comprar um plano com o saldo da carteira")
    public ResponseEntity<CarteiraResponse> comprarPlano(
            @AuthenticationPrincipal AuthenticatedUsers authenticated,
            @RequestBody Map<String, Object> body) {
        UUID planoId = UUID.fromString(body.get("planoId").toString());
        String metodoPagamento = body.getOrDefault("metodoPagamento", "Carteira Virtual").toString();
        return ResponseEntity.ok(assinaturaService.comprarPlano(authenticated.usuario(), planoId, metodoPagamento));
    }

    @GetMapping("/assinatura-ativa")
    @Operation(summary = "Verificar se o usuário possui assinatura ativa")
    public ResponseEntity<Map<String, Boolean>> possuiAssinaturaAtiva(
            @AuthenticationPrincipal AuthenticatedUsers authenticated) {
        boolean ativa = assinaturaService.possuiAssinaturaAtiva(authenticated.usuario());
        return ResponseEntity.ok(Map.of("ativa", ativa));
    }
}
