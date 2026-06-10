package com.br.gabriel.api.repository;

import com.br.gabriel.api.entity.Assinatura;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AssinaturaRepository extends JpaRepository<Assinatura, UUID> {
    Optional<Assinatura> findTopByUsuario_IdUsuarioAndDataFimGreaterThanEqualOrderByDataFimDesc(UUID idUsuario, LocalDate hoje);
    boolean existsByUsuario_IdUsuarioAndDataFimGreaterThanEqual(UUID idUsuario, LocalDate hoje);
}
