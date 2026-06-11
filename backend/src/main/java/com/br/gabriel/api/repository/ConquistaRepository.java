package com.br.gabriel.api.repository;

import com.br.gabriel.api.entity.Conquista;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ConquistaRepository extends JpaRepository<Conquista, UUID> {
}
