package com.br.gabriel.api.repository;

import com.br.gabriel.api.entity.TrilhaProgresso;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface TrilhaProgressoRepository extends JpaRepository<TrilhaProgresso, UUID> {

    Optional<TrilhaProgresso> findByUsuario_IdUsuarioAndTrilha_IdTrilhaAndCurso_IdCurso(
            UUID idUsuario, UUID idTrilha, UUID idCurso);

    long countByUsuario_IdUsuarioAndTrilha_IdTrilhaAndCompletadoTrue(
            UUID idUsuario, UUID idTrilha);

    long countByTrilha_IdTrilha(UUID idTrilha);

    void deleteByTrilha_IdTrilha(UUID idTrilha);
}
