package com.br.gabriel.api.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@RequiredArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "aulas")
public class Aula {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id_aula")
    private UUID idAula;

    @ManyToOne
    @JoinColumn(name = "id_modulo", nullable = false)
    private Modulo modulo;

    @Column(name = "titulo", nullable = false)
    private String titulo;

    @Column(name = "tipo_conteudo")
    private String tipoConteudo;

    @Column(name = "url_conteudo")
    private String urlConteudo;

    @Column(name = "duracao_minutos")
    private Integer duracaoMinutos;

    @Column(name = "ordem", nullable = false)
    private Integer ordem;
}
