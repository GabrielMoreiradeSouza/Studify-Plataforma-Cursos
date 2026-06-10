package com.br.gabriel.api.repository;

import com.br.gabriel.api.entity.Trilha;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface TrilhaRepository extends JpaRepository<Trilha, UUID> {
}
