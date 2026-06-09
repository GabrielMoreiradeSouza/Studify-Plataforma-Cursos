package com.br.gabriel.api.repository;

import com.br.gabriel.api.entity.Progresso;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ProgressoRepository extends JpaRepository<Progresso, UUID> {
    Optional<Progresso> findByUsuario_IdUsuarioAndLesson_IdLesson(UUID idUsuario, UUID idLesson);
    List<Progresso> findByUsuario_IdUsuarioAndLesson_Curso_IdCurso(UUID idUsuario, UUID idCurso);
    long countByLesson_Curso_IdCursoAndCompletadoTrueAndUsuario_IdUsuario(UUID idCurso, UUID idUsuario);
    long countByLesson_Curso_IdCurso(UUID idCurso);
    void deleteByLesson_IdLesson(UUID lessonId);
}
