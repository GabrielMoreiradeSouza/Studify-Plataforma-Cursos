package com.br.gabriel.api.service;

import com.br.gabriel.api.dto.response.ProgressoResponse;
import com.br.gabriel.api.entity.Lesson;
import com.br.gabriel.api.entity.Progresso;
import com.br.gabriel.api.entity.Usuario;
import com.br.gabriel.api.exception.ResourceNotFoundException;
import com.br.gabriel.api.repository.LessonRepository;
import com.br.gabriel.api.repository.ProgressoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class ProgressoService {

    private final ProgressoRepository progressoRepository;
    private final LessonRepository lessonRepository;

    public ProgressoService(ProgressoRepository progressoRepository, LessonRepository lessonRepository) {
        this.progressoRepository = progressoRepository;
        this.lessonRepository = lessonRepository;
    }

    @Transactional
    public ProgressoResponse marcarCompleta(UUID lessonId, Usuario usuario) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new ResourceNotFoundException("Aula não encontrada"));

        Progresso progresso = progressoRepository
                .findByUsuario_IdUsuarioAndLesson_IdLesson(usuario.getIdUsuario(), lessonId)
                .orElseGet(() -> {
                    Progresso p = new Progresso();
                    p.setUsuario(usuario);
                    p.setLesson(lesson);
                    return p;
                });

        progresso.setCompletado(true);
        progresso.setDataConclusao(LocalDateTime.now());
        progresso = progressoRepository.save(progresso);

        return toResponse(progresso);
    }

    public List<ProgressoResponse> listarProgresso(UUID cursoId, Usuario usuario) {
        return progressoRepository
                .findByUsuario_IdUsuarioAndLesson_Curso_IdCurso(usuario.getIdUsuario(), cursoId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private ProgressoResponse toResponse(Progresso p) {
        return new ProgressoResponse(
                p.getIdProgresso(),
                p.getLesson().getIdLesson(),
                p.getCompletado(),
                p.getDataConclusao()
        );
    }
}
