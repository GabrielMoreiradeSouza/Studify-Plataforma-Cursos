package com.br.gabriel.api.controller;

import com.br.gabriel.api.dto.request.CreateCursoRequest;
import com.br.gabriel.api.dto.response.CursoResponse;
import com.br.gabriel.api.dto.response.LessonResponse;
import com.br.gabriel.api.dto.response.ProgressoResponse;
import com.br.gabriel.api.entity.Usuario;
import com.br.gabriel.api.security.AuthenticatedUsers;
import com.br.gabriel.api.service.CursoService;
import com.br.gabriel.api.service.LessonService;
import com.br.gabriel.api.service.ProgressoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/courses")
@Tag(name = "Cursos", description = "Endpoints de cursos e aulas")
public class CursoController {

    private final CursoService cursoService;
    private final LessonService lessonService;
    private final ProgressoService progressoService;

    public CursoController(CursoService cursoService, LessonService lessonService, ProgressoService progressoService) {
        this.cursoService = cursoService;
        this.lessonService = lessonService;
        this.progressoService = progressoService;
    }

    @GetMapping("/all")
    @Operation(summary = "Listar todos os cursos")
    public ResponseEntity<List<CursoResponse>> listAll() {
        return ResponseEntity.ok(cursoService.listAll());
    }

    @GetMapping
    @Operation(summary = "Listar cursos do instrutor autenticado")
    public ResponseEntity<List<CursoResponse>> list(
            @AuthenticationPrincipal AuthenticatedUsers authenticated) {
        List<CursoResponse> cursos = cursoService.listByInstrutor(authenticated.usuario().getIdUsuario());
        return ResponseEntity.ok(cursos);
    }

    @PostMapping
    @Operation(summary = "Criar um novo curso")
    public ResponseEntity<CursoResponse> create(
            @Valid @RequestBody CreateCursoRequest body,
            @AuthenticationPrincipal AuthenticatedUsers authenticated) {
        Usuario instrutor = authenticated.usuario();
        CursoResponse response = cursoService.create(body, instrutor);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @DeleteMapping("/{courseId}")
    @Operation(summary = "Excluir um curso")
    public ResponseEntity<Void> deleteCourse(@PathVariable UUID courseId) {
        cursoService.deleteById(courseId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping(value = "/{courseId}/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload de imagem do curso (png/jpg)")
    public ResponseEntity<CursoResponse> uploadImage(
            @PathVariable UUID courseId,
            @RequestParam("file") MultipartFile file) {
        String ct = file.getContentType();
        if (ct == null || !(ct.equals("image/png") || ct.equals("image/jpeg"))) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(cursoService.uploadImagem(courseId, file));
    }

    @GetMapping("/{courseId}/image")
    @Operation(summary = "Stream da imagem do curso")
    public ResponseEntity<Resource> streamImage(@PathVariable UUID courseId) {
        return cursoService.streamImagem(courseId);
    }

    @GetMapping("/{courseId}/lessons")
    @Operation(summary = "Listar aulas de um curso")
    public ResponseEntity<List<LessonResponse>> listLessons(@PathVariable UUID courseId) {
        return ResponseEntity.ok(lessonService.listByCurso(courseId));
    }

    @GetMapping("/{courseId}/lessons/{lessonId}/video")
    @Operation(summary = "Stream do vídeo de uma aula")
    public ResponseEntity<Resource> streamVideo(
            @PathVariable UUID lessonId,
            @RequestHeader(value = "Range", required = false) String rangeHeader) {
        return lessonService.streamVideo(lessonId, rangeHeader);
    }

    @PostMapping("/{courseId}/lessons/{lessonId}/completar")
    @Operation(summary = "Marcar aula como concluída")
    public ResponseEntity<ProgressoResponse> completarAula(
            @PathVariable UUID courseId,
            @PathVariable UUID lessonId,
            @RequestParam(required = false) UUID trilhaId,
            @AuthenticationPrincipal AuthenticatedUsers authenticated) {
        return ResponseEntity.ok(progressoService.marcarCompleta(lessonId, authenticated.usuario(), trilhaId));
    }

    @GetMapping("/{courseId}/progresso")
    @Operation(summary = "Obter progresso do usuário no curso")
    public ResponseEntity<List<ProgressoResponse>> progresso(
            @PathVariable UUID courseId,
            @AuthenticationPrincipal AuthenticatedUsers authenticated) {
        return ResponseEntity.ok(progressoService.listarProgresso(courseId, authenticated.usuario()));
    }

    @DeleteMapping("/{courseId}/lessons/{lessonId}")
    @Operation(summary = "Excluir uma aula")
    public ResponseEntity<Void> deleteLesson(@PathVariable UUID lessonId) {
        lessonService.deleteLesson(lessonId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping(value = "/{courseId}/lessons", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Fazer upload de vídeo .mp4 para uma aula do curso")
    public ResponseEntity<LessonResponse> uploadLesson(
            @PathVariable UUID courseId,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "titulo", required = false) String titulo,
            @RequestParam(value = "ordem", required = false) Integer ordem) {
        LessonResponse response = lessonService.upload(courseId, file, titulo, ordem);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
