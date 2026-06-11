package com.br.gabriel.api.repository;

import com.br.gabriel.api.entity.Progresso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ProgressoRepository extends JpaRepository<Progresso, UUID> {
    Optional<Progresso> findByUsuario_IdUsuarioAndLesson_IdLesson(UUID idUsuario, UUID idLesson);
    List<Progresso> findByUsuario_IdUsuarioAndLesson_Curso_IdCurso(UUID idUsuario, UUID idCurso);
    long countByLesson_Curso_IdCursoAndCompletadoTrueAndUsuario_IdUsuario(UUID idCurso, UUID idUsuario);
    long countByLesson_Curso_IdCurso(UUID idCurso);
    void deleteByLesson_IdLesson(UUID lessonId);

    @Query("SELECT DISTINCT p.lesson.curso.idCurso FROM Progresso p WHERE p.usuario.idUsuario = :idUsuario AND p.completado = true")
    List<UUID> findDistinctCursoIdsByUsuario(@Param("idUsuario") UUID idUsuario);
}
