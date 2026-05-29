package com.br.gabriel.api.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@RequiredArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "trilhas_cursos")
public class TrilhaCurso {

    @EmbeddedId
    private TrilhaCursoId id;

    @ManyToOne
    @MapsId("idTrilha")
    @JoinColumn(name = "id_trilha", nullable = false)
    private Trilha trilha;

    @ManyToOne
    @MapsId("idCurso")
    @JoinColumn(name = "id_curso", nullable = false)
    private Curso curso;

    @Column(name = "ordem", nullable = false)
    private Integer ordem;
}
