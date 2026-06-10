package com.br.gabriel.api.repository;

import com.br.gabriel.api.entity.TrilhaCurso;
import com.br.gabriel.api.entity.TrilhaCursoId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface TrilhaCursoRepository extends JpaRepository<TrilhaCurso, TrilhaCursoId> {
    List<TrilhaCurso> findByIdIdTrilhaOrderByOrdemAsc(UUID idTrilha);
    void deleteByIdIdTrilha(UUID idTrilha);
    void deleteByIdIdCurso(UUID idCurso);
}
