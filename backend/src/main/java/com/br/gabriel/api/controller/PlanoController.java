package com.br.gabriel.api.controller;

import com.br.gabriel.api.dto.response.PlanoResponse;
import com.br.gabriel.api.service.PlanoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/planos")
@Tag(name = "Planos", description = "Endpoints de planos de assinatura")
public class PlanoController {

    private final PlanoService planoService;

    public PlanoController(PlanoService planoService) {
        this.planoService = planoService;
    }

    @GetMapping
    @Operation(summary = "Listar todos os planos disponíveis")
    public ResponseEntity<List<PlanoResponse>> listAll() {
        return ResponseEntity.ok(planoService.listAll());
    }
}
