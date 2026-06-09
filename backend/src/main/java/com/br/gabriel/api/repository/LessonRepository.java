package com.br.gabriel.api.repository;

import com.br.gabriel.api.entity.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface LessonRepository extends JpaRepository<Lesson, UUID> {
    List<Lesson> findByCurso_IdCursoOrderByOrdemAsc(UUID idCurso);
}
