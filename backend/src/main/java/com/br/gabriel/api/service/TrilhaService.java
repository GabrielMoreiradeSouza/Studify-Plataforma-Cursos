package com.br.gabriel.api.service;

import com.br.gabriel.api.dto.request.AddCursoToTrilhaRequest;
import com.br.gabriel.api.dto.request.CreateTrilhaRequest;
import com.br.gabriel.api.dto.response.CursoResponse;
import com.br.gabriel.api.dto.response.TrilhaResponse;
import com.br.gabriel.api.entity.Categoria;
import com.br.gabriel.api.entity.Curso;
import com.br.gabriel.api.entity.Trilha;
import com.br.gabriel.api.entity.TrilhaCurso;
import com.br.gabriel.api.entity.TrilhaCursoId;
import com.br.gabriel.api.exception.ResourceNotFoundException;
import com.br.gabriel.api.repository.CategoriaRepository;
import com.br.gabriel.api.repository.CursoRepository;
import com.br.gabriel.api.repository.TrilhaCursoRepository;
import com.br.gabriel.api.repository.TrilhaRepository;
import com.br.gabriel.api.config.S3Properties;
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

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class TrilhaService {

    private final TrilhaRepository trilhaRepository;
    private final TrilhaCursoRepository trilhaCursoRepository;
    private final CategoriaRepository categoriaRepository;
    private final CursoRepository cursoRepository;
    private final S3Client s3Client;
    private final S3Properties s3Properties;

    public TrilhaService(TrilhaRepository trilhaRepository, TrilhaCursoRepository trilhaCursoRepository, CategoriaRepository categoriaRepository, CursoRepository cursoRepository, S3Client s3Client, S3Properties s3Properties) {
        this.trilhaRepository = trilhaRepository;
        this.trilhaCursoRepository = trilhaCursoRepository;
        this.categoriaRepository = categoriaRepository;
        this.cursoRepository = cursoRepository;
        this.s3Client = s3Client;
        this.s3Properties = s3Properties;
    }

    public List<TrilhaResponse> listAll() {
        return trilhaRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    public TrilhaResponse getById(UUID id) {
        Trilha trilha = trilhaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Trilha não encontrada"));
        return toResponse(trilha);
    }

    @Transactional
    public TrilhaResponse create(CreateTrilhaRequest request) {
        Categoria categoria = categoriaRepository.findById(request.categoriaId())
                .orElseThrow(() -> new ResourceNotFoundException("Categoria não encontrada"));

        Trilha trilha = new Trilha();
        trilha.setTitulo(request.titulo());
        trilha.setDescricao(request.descricao());
        trilha.setCategoria(categoria);
        trilha.setTotalCursos(0);

        trilha = trilhaRepository.save(trilha);

        return toResponse(trilha);
    }

    @Transactional
    public void deleteById(UUID id) {
        Trilha trilha = trilhaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Trilha não encontrada"));

        if (trilha.getImagemKey() != null) {
            try {
                s3Client.deleteObject(DeleteObjectRequest.builder()
                        .bucket(s3Properties.getBucketLessons())
                        .key(trilha.getImagemKey())
                        .build());
            } catch (Exception ignored) { }
        }

        trilhaCursoRepository.deleteByIdIdTrilha(id);
        trilhaRepository.delete(trilha);
    }

    @Transactional
    public TrilhaResponse uploadImagem(UUID trilhaId, MultipartFile file) {
        Trilha trilha = trilhaRepository.findById(trilhaId)
                .orElseThrow(() -> new ResourceNotFoundException("Trilha não encontrada"));

        String ext = file.getOriginalFilename();
        ext = ext != null && ext.contains(".") ? ext.substring(ext.lastIndexOf(".")) : ".jpg";
        String s3Key = "trilha-thumbnails/" + trilhaId + ext;

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

        trilha.setImagemKey(s3Key);
        trilha = trilhaRepository.save(trilha);

        return toResponse(trilha);
    }

    public ResponseEntity<Resource> streamImagem(UUID trilhaId) {
        Trilha trilha = trilhaRepository.findById(trilhaId)
                .orElseThrow(() -> new ResourceNotFoundException("Trilha não encontrada"));

        if (trilha.getImagemKey() == null) {
            return ResponseEntity.notFound().build();
        }

        try {
            GetObjectRequest getRequest = GetObjectRequest.builder()
                    .bucket(s3Properties.getBucketLessons())
                    .key(trilha.getImagemKey())
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

    @Transactional
    public TrilhaResponse addCurso(UUID trilhaId, AddCursoToTrilhaRequest request) {
        Trilha trilha = trilhaRepository.findById(trilhaId)
                .orElseThrow(() -> new ResourceNotFoundException("Trilha não encontrada"));
        Curso curso = cursoRepository.findById(request.cursoId())
                .orElseThrow(() -> new ResourceNotFoundException("Curso não encontrado"));

        TrilhaCursoId id = new TrilhaCursoId(trilhaId, request.cursoId());
        if (trilhaCursoRepository.findById(id).isPresent()) {
            throw new RuntimeException("Curso já adicionado a esta trilha");
        }

        TrilhaCurso tc = new TrilhaCurso();
        tc.setId(id);
        tc.setTrilha(trilha);
        tc.setCurso(curso);
        tc.setOrdem(request.ordem() != null ? request.ordem() : 0);
        trilhaCursoRepository.save(tc);

        trilha.setTotalCursos(trilha.getTotalCursos() != null ? trilha.getTotalCursos() + 1 : 1);
        trilhaRepository.save(trilha);

        return toResponse(trilha);
    }

    @Transactional
    public TrilhaResponse removeCurso(UUID trilhaId, UUID cursoId) {
        Trilha trilha = trilhaRepository.findById(trilhaId)
                .orElseThrow(() -> new ResourceNotFoundException("Trilha não encontrada"));

        TrilhaCursoId id = new TrilhaCursoId(trilhaId, cursoId);
        trilhaCursoRepository.deleteById(id);

        trilha.setTotalCursos(trilha.getTotalCursos() != null ? Math.max(0, trilha.getTotalCursos() - 1) : 0);
        trilhaRepository.save(trilha);

        return toResponse(trilha);
    }

    private TrilhaResponse toResponse(Trilha trilha) {
        List<TrilhaCurso> tcs = trilhaCursoRepository.findByIdIdTrilhaOrderByOrdemAsc(trilha.getIdTrilha());
        List<CursoResponse> cursos = tcs.stream()
                .map(tc -> toCursoResponse(tc.getCurso()))
                .toList();

        return new TrilhaResponse(
                trilha.getIdTrilha(),
                trilha.getTitulo(),
                trilha.getDescricao(),
                trilha.getDataCriacao(),
                trilha.getTotalCursos(),
                trilha.getImagemKey(),
                trilha.getCategoria().getIdCategoria(),
                trilha.getCategoria().getNome(),
                cursos
        );
    }

    private CursoResponse toCursoResponse(Curso curso) {
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
}
