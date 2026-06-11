package com.br.gabriel.api.controller;

import com.br.gabriel.api.dto.response.CertificadoResponse;
import com.br.gabriel.api.security.AuthenticatedUsers;
import com.br.gabriel.api.service.CertificadoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/certificados")
@Tag(name = "Certificados", description = "Endpoints de certificados")
public class CertificadoController {

    private final CertificadoService certificadoService;

    public CertificadoController(CertificadoService certificadoService) {
        this.certificadoService = certificadoService;
    }

    @GetMapping
    @Operation(summary = "Listar certificados do usuário autenticado")
    public ResponseEntity<List<CertificadoResponse>> listar(
            @AuthenticationPrincipal AuthenticatedUsers authenticated) {
        return ResponseEntity.ok(certificadoService.listarCertificados(authenticated.usuario()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar certificado por ID")
    public ResponseEntity<CertificadoResponse> buscar(@PathVariable UUID id) {
        return ResponseEntity.ok(certificadoService.buscarPorId(id));
    }

    @GetMapping("/{id}/html")
    @Operation(summary = "Visualizar certificado em HTML")
    public ResponseEntity<String> visualizarHtml(@PathVariable UUID id) {
        CertificadoResponse dto = certificadoService.buscarPorId(id);
        String html = certificadoService.gerarHtmlCertificado(dto);
        return ResponseEntity.ok()
                .contentType(MediaType.TEXT_HTML)
                .body(html);
    }
}
