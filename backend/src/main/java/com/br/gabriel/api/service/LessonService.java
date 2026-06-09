package com.br.gabriel.api.service;

import com.br.gabriel.api.config.S3Properties;
import com.br.gabriel.api.dto.response.LessonResponse;
import com.br.gabriel.api.entity.Curso;
import com.br.gabriel.api.entity.Lesson;
import com.br.gabriel.api.exception.ResourceNotFoundException;
import com.br.gabriel.api.repository.CursoRepository;
import com.br.gabriel.api.repository.LessonRepository;
import com.br.gabriel.api.repository.ProgressoRepository;
import org.springframework.stereotype.Service;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.HeadObjectRequest;
import software.amazon.awssdk.services.s3.model.HeadObjectResponse;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;


import java.io.InputStream;
import java.util.List;
import java.util.UUID;

@Service
public class LessonService {

    private final LessonRepository lessonRepository;
    private final CursoRepository cursoRepository;
    private final ProgressoRepository progressoRepository;
    private final S3Client s3Client;
    private final S3Properties s3Properties;

    public LessonService(LessonRepository lessonRepository, CursoRepository cursoRepository, ProgressoRepository progressoRepository, S3Client s3Client, S3Properties s3Properties) {
        this.lessonRepository = lessonRepository;
        this.cursoRepository = cursoRepository;
        this.progressoRepository = progressoRepository;
        this.s3Client = s3Client;
        this.s3Properties = s3Properties;
    }

    public List<LessonResponse> listByCurso(UUID cursoId) {
        return lessonRepository.findByCurso_IdCursoOrderByOrdemAsc(cursoId).stream()
                .map(this::toResponse)
                .toList();
    }

    public ResponseEntity<Resource> streamVideo(UUID lessonId, String rangeHeader) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new ResourceNotFoundException("Aula não encontrada"));

        try {
            HeadObjectResponse metadata = s3Client
                    .headObject(HeadObjectRequest.builder()
                            .bucket(s3Properties.getBucketLessons())
                            .key(lesson.getS3Key())
                            .build());

            long fileLength = metadata.contentLength();
            String contentType = metadata.contentType() != null ? metadata.contentType() : "video/mp4";

            if (rangeHeader == null || !rangeHeader.startsWith("bytes=")) {
                GetObjectRequest getRequest = GetObjectRequest.builder()
                        .bucket(s3Properties.getBucketLessons())
                        .key(lesson.getS3Key())
                        .build();

                InputStream s3Stream = s3Client.getObject(getRequest);
                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .contentLength(fileLength)
                        .header(HttpHeaders.ACCEPT_RANGES, "bytes")
                        .body(new InputStreamResource(s3Stream));
            }

            String[] ranges = rangeHeader.substring("bytes=".length()).split("-");
            long start = Long.parseLong(ranges[0]);
            long end = ranges.length > 1 && !ranges[1].isEmpty() ? Long.parseLong(ranges[1]) : fileLength - 1;
            if (end >= fileLength) end = fileLength - 1;
            long length = end - start + 1;

            GetObjectRequest getRequest = GetObjectRequest.builder()
                    .bucket(s3Properties.getBucketLessons())
                    .key(lesson.getS3Key())
                    .range("bytes=" + start + "-" + end)
                    .build();

            InputStream s3Stream = s3Client.getObject(getRequest);

            return ResponseEntity.status(HttpStatus.PARTIAL_CONTENT)
                    .contentType(MediaType.parseMediaType(contentType))
                    .contentLength(length)
                    .header(HttpHeaders.ACCEPT_RANGES, "bytes")
                    .header("Content-Range", "bytes " + start + "-" + end + "/" + fileLength)
                    .body(new InputStreamResource(s3Stream));
        } catch (Exception e) {
            throw new RuntimeException("Erro ao buscar vídeo do S3", e);
        }
    }

    @Transactional
    public LessonResponse upload(UUID cursoId, MultipartFile file, String titulo, Integer ordem) {
        Curso curso = cursoRepository.findById(cursoId)
                .orElseThrow(() -> new ResourceNotFoundException("Curso não encontrado"));

        String s3Key = "courses/" + cursoId + "/" + UUID.randomUUID() + ".mp4";

        uploadToS3(file, s3Key);

        Lesson lesson = new Lesson();
        lesson.setCurso(curso);
        lesson.setTitulo(titulo);
        lesson.setS3Key(s3Key);
        lesson.setDuracaoSegundos(null);
        lesson.setOrdem(ordem);

        lesson = lessonRepository.save(lesson);

        curso.setTotalAulas(curso.getTotalAulas() != null ? curso.getTotalAulas() + 1 : 1);
        cursoRepository.save(curso);

        return toResponse(lesson);
    }

    @Transactional
    public void deleteLesson(UUID lessonId) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new ResourceNotFoundException("Aula não encontrada"));

        try {
            s3Client.deleteObject(DeleteObjectRequest.builder()
                    .bucket(s3Properties.getBucketLessons())
                    .key(lesson.getS3Key())
                    .build());
        } catch (Exception e) {
            throw new RuntimeException("Erro ao remover arquivo do S3", e);
        }

        progressoRepository.deleteByLesson_IdLesson(lessonId);

        Curso curso = lesson.getCurso();
        curso.setTotalAulas(curso.getTotalAulas() != null ? Math.max(0, curso.getTotalAulas() - 1) : 0);
        cursoRepository.save(curso);

        lessonRepository.delete(lesson);
    }

    private void uploadToS3(MultipartFile file, String s3Key) {
        try {
            PutObjectRequest putRequest = PutObjectRequest.builder()
                    .bucket(s3Properties.getBucketLessons())
                    .key(s3Key)
                    .contentType(file.getContentType())
                    .build();

            s3Client.putObject(putRequest, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));
        } catch (Exception e) {
            throw new RuntimeException("Erro ao fazer upload do arquivo para o S3", e);
        }
    }

    private LessonResponse toResponse(Lesson lesson) {
        return new LessonResponse(
                lesson.getIdLesson(),
                lesson.getCurso().getIdCurso(),
                lesson.getTitulo(),
                lesson.getS3Key(),
                lesson.getDuracaoSegundos(),
                lesson.getOrdem(),
                lesson.getDataUpload()
        );
    }
}
