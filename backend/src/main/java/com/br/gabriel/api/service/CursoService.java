package com.br.gabriel.api.service;

import com.br.gabriel.api.config.S3Properties;
import com.br.gabriel.api.dto.request.CreateCursoRequest;
import com.br.gabriel.api.dto.response.CursoResponse;
import com.br.gabriel.api.entity.Categoria;
import com.br.gabriel.api.entity.Curso;
import com.br.gabriel.api.entity.Lesson;
import com.br.gabriel.api.entity.Usuario;
import com.br.gabriel.api.exception.ResourceNotFoundException;
import com.br.gabriel.api.repository.CategoriaRepository;
import com.br.gabriel.api.repository.CursoRepository;
import com.br.gabriel.api.repository.LessonRepository;
import com.br.gabriel.api.repository.ProgressoRepository;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.util.List;
import java.time.LocalDate;
import java.util.UUID;

@Service
public class CursoService {

    private final CursoRepository cursoRepository;
    private final CategoriaRepository categoriaRepository;
    private final LessonRepository lessonRepository;
    private final ProgressoRepository progressoRepository;
    private final S3Client s3Client;
    private final S3Properties s3Properties;

    public CursoService(CursoRepository cursoRepository, CategoriaRepository categoriaRepository, LessonRepository lessonRepository, ProgressoRepository progressoRepository, S3Client s3Client, S3Properties s3Properties) {
        this.cursoRepository = cursoRepository;
        this.categoriaRepository = categoriaRepository;
        this.lessonRepository = lessonRepository;
        this.progressoRepository = progressoRepository;
        this.s3Client = s3Client;
        this.s3Properties = s3Properties;
    }

    public List<CursoResponse> listByInstrutor(UUID instrutorId) {
        return cursoRepository.findByInstrutor_IdUsuario(instrutorId).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public CursoResponse create(CreateCursoRequest request, Usuario instrutor) {
        Categoria categoria = categoriaRepository.findById(request.categoriaId())
                .orElseThrow(() -> new ResourceNotFoundException("Categoria não encontrada"));

        Curso curso = new Curso();
        curso.setTitulo(request.titulo());
        curso.setDescricao(request.descricao());
        curso.setInstrutor(instrutor);
        curso.setCategoria(categoria);
        curso.setNivel(request.nivel());
        curso.setDataPublicacao(LocalDate.now());
        curso.setTotalAulas(0);
        curso.setTotalHoras(0);

        curso = cursoRepository.save(curso);

        return toResponse(curso);
    }

    private CursoResponse toResponse(Curso curso) {
        return new CursoResponse(
                curso.getIdCurso(),
                curso.getTitulo(),
                curso.getDescricao(),
                curso.getInstrutor().getIdUsuario(),
                curso.getInstrutor().getNomeCompleto(),
                curso.getCategoria().getIdCategoria(),
                curso.getCategoria().getNome(),
                curso.getNivel(),
                curso.getDataPublicacao(),
                curso.getTotalAulas(),
                curso.getTotalHoras(),
                curso.getImagemKey()
        );
    }

    public List<CursoResponse> listAll() {
        return cursoRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public void deleteById(UUID id) {
        Curso curso = cursoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Curso não encontrado"));

        List<Lesson> lessons = lessonRepository.findByCurso_IdCursoOrderByOrdemAsc(id);

        for (Lesson lesson : lessons) {
            try {
                s3Client.deleteObject(DeleteObjectRequest.builder()
                        .bucket(s3Properties.getBucketLessons())
                        .key(lesson.getS3Key())
                        .build());
            } catch (Exception ignored) { }
            progressoRepository.deleteByLesson_IdLesson(lesson.getIdLesson());
        }

        if (!lessons.isEmpty()) {
            lessonRepository.deleteAll(lessons);
        }

        if (curso.getImagemKey() != null) {
            try {
                s3Client.deleteObject(DeleteObjectRequest.builder()
                        .bucket(s3Properties.getBucketLessons())
                        .key(curso.getImagemKey())
                        .build());
            } catch (Exception ignored) { }
        }

        cursoRepository.delete(curso);
    }

    @Transactional
    public CursoResponse uploadImagem(UUID cursoId, MultipartFile file) {
        Curso curso = cursoRepository.findById(cursoId)
                .orElseThrow(() -> new ResourceNotFoundException("Curso não encontrado"));

        String ext = file.getOriginalFilename();
        ext = ext != null && ext.contains(".") ? ext.substring(ext.lastIndexOf(".")) : ".jpg";
        String s3Key = "course-thumbnails/" + cursoId + ext;

        try {
            PutObjectRequest putRequest = PutObjectRequest.builder()
                    .bucket(s3Properties.getBucketLessons())
                    .key(s3Key)
                    .contentType(file.getContentType())
                    .build();
            s3Client.putObject(putRequest, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));
        } catch (Exception e) {
            throw new RuntimeException("Erro ao fazer upload da imagem para o S3", e);
        }

        curso.setImagemKey(s3Key);
        curso = cursoRepository.save(curso);

        return toResponse(curso);
    }

    public ResponseEntity<Resource> streamImagem(UUID cursoId) {
        Curso curso = cursoRepository.findById(cursoId)
                .orElseThrow(() -> new ResourceNotFoundException("Curso não encontrado"));

        if (curso.getImagemKey() == null) {
            return ResponseEntity.notFound().build();
        }

        try {
            GetObjectRequest getRequest = GetObjectRequest.builder()
                    .bucket(s3Properties.getBucketLessons())
                    .key(curso.getImagemKey())
                    .build();

            var s3Stream = s3Client.getObject(getRequest);
            String ct = s3Stream.response().contentType();
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(ct != null ? ct : "image/jpeg"))
                    .body(new InputStreamResource(s3Stream));
        } catch (Exception e) {
            throw new RuntimeException("Erro ao buscar imagem do S3", e);
        }
    }
}
