package com.br.gabriel.api.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
@Embeddable
public class TrilhaCursoId implements Serializable {

    @Column(name = "id_trilha", nullable = false)
    private UUID idTrilha;

    @Column(name = "id_curso", nullable = false)
    private UUID idCurso;
}
