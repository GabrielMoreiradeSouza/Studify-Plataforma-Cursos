package com.br.gabriel.api.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.UUID;

@Getter
@Setter
@RequiredArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "trilha_progresso", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"id_usuario", "id_trilha", "id_curso"})
})
public class TrilhaProgresso {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id_trilha_progresso")
    private UUID idTrilhaProgresso;

    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "id_trilha", nullable = false)
    private Trilha trilha;

    @ManyToOne
    @JoinColumn(name = "id_curso", nullable = false)
    private Curso curso;

    @Column(name = "completado", nullable = false)
    private Boolean completado = false;

    @Column(name = "data_conclusao")
    private LocalDate dataConclusao;
}
