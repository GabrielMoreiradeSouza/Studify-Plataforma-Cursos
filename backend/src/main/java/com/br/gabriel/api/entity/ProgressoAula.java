package com.br.gabriel.api.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@RequiredArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "progresso_aulas")
public class ProgressoAula {

    @EmbeddedId
    private ProgressoAulaId id;

    @ManyToOne
    @MapsId("idUsuario")
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @ManyToOne
    @MapsId("idAula")
    @JoinColumn(name = "id_aula", nullable = false)
    private Aula aula;

    @Column(name = "data_conclusao")
    private LocalDate dataConclusao;

    @Column(name = "status")
    private String status;
}
