package com.br.gabriel.api.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@RequiredArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "progresso", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"id_usuario", "id_lesson"})
})
public class Progresso {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id_progresso")
    private UUID idProgresso;

    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "id_lesson", nullable = false)
    private Lesson lesson;

    @Column(name = "completado", nullable = false)
    private Boolean completado = false;

    @Column(name = "data_conclusao")
    private LocalDateTime dataConclusao;
}
