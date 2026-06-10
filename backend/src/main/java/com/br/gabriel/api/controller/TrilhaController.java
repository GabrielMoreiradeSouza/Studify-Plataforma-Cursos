package com.br.gabriel.api.controller;

import com.br.gabriel.api.dto.request.AddCursoToTrilhaRequest;
import com.br.gabriel.api.dto.request.CreateTrilhaRequest;
import com.br.gabriel.api.dto.response.TrilhaResponse;
import com.br.gabriel.api.service.TrilhaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/trilhas")
@Tag(name = "Trilhas", description = "Endpoints de trilhas de cursos")
public class TrilhaController {

    private final TrilhaService trilhaService;

    public TrilhaController(TrilhaService trilhaService) {
        this.trilhaService = trilhaService;
    }

    @GetMapping
    @Operation(summary = "Listar todas as trilhas")
    public ResponseEntity<List<TrilhaResponse>> listAll() {
        return ResponseEntity.ok(trilhaService.listAll());
    }

    @GetMapping("/{trilhaId}")
    @Operation(summary = "Obter detalhes de uma trilha com seus cursos")
    public ResponseEntity<TrilhaResponse> getById(@PathVariable UUID trilhaId) {
        return ResponseEntity.ok(trilhaService.getById(trilhaId));
    }

    @PostMapping
    @Operation(summary = "Criar uma nova trilha")
    public ResponseEntity<TrilhaResponse> create(@Valid @RequestBody CreateTrilhaRequest body) {
        return ResponseEntity.status(HttpStatus.CREATED).body(trilhaService.create(body));
    }

    @DeleteMapping("/{trilhaId}")
    @Operation(summary = "Excluir uma trilha")
    public ResponseEntity<Void> delete(@PathVariable UUID trilhaId) {
        trilhaService.deleteById(trilhaId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{trilhaId}/cursos")
    @Operation(summary = "Adicionar curso a uma trilha")
    public ResponseEntity<TrilhaResponse> addCurso(
            @PathVariable UUID trilhaId,
            @Valid @RequestBody AddCursoToTrilhaRequest body) {
        return ResponseEntity.ok(trilhaService.addCurso(trilhaId, body));
    }

    @PostMapping(value = "/{trilhaId}/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload de imagem da trilha (png/jpg)")
    public ResponseEntity<TrilhaResponse> uploadImage(
            @PathVariable UUID trilhaId,
            @RequestParam("file") MultipartFile file) {
        String ct = file.getContentType();
        if (ct == null || !(ct.equals("image/png") || ct.equals("image/jpeg"))) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(trilhaService.uploadImagem(trilhaId, file));
    }

    @GetMapping("/{trilhaId}/image")
    @Operation(summary = "Stream da imagem da trilha")
    public ResponseEntity<Resource> streamImage(@PathVariable UUID trilhaId) {
        return trilhaService.streamImagem(trilhaId);
    }

    @DeleteMapping("/{trilhaId}/cursos/{cursoId}")
    @Operation(summary = "Remover curso de uma trilha")
    public ResponseEntity<TrilhaResponse> removeCurso(
            @PathVariable UUID trilhaId,
            @PathVariable UUID cursoId) {
        return ResponseEntity.ok(trilhaService.removeCurso(trilhaId, cursoId));
    }
}
