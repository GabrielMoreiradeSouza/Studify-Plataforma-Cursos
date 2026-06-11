package com.br.gabriel.api.repository;

import com.br.gabriel.api.entity.UsuarioConquista;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UsuarioConquistaRepository extends JpaRepository<UsuarioConquista, UUID> {

    List<UsuarioConquista> findByUsuario_IdUsuario(UUID idUsuario);

    Optional<UsuarioConquista> findByUsuario_IdUsuarioAndConquista_IdConquista(UUID idUsuario, UUID idConquista);

    boolean existsByUsuario_IdUsuarioAndConquista_IdConquista(UUID idUsuario, UUID idConquista);
}
