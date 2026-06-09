package com.br.gabriel.api.repository;

import com.br.gabriel.api.entity.Curso;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface CursoRepository extends JpaRepository<Curso, UUID> {
    List<Curso> findByInstrutor_IdUsuario(UUID idInstrutor);
}
