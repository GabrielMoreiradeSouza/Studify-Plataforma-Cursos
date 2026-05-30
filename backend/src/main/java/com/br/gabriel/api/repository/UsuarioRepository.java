package com.br.gabriel.api.repository;

import com.br.gabriel.api.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, UUID> {
        boolean existsByEmail(String email);
}
