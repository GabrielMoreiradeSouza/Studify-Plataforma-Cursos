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
public class ProgressoAulaId implements Serializable {

    @Column(name = "id_usuario", nullable = false)
    private UUID idUsuario;

    @Column(name = "id_aula", nullable = false)
    private UUID idAula;
}
