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
@Table(name = "cursos")
public class Curso {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id_curso")
    private UUID idCurso;

    @Column(name = "titulo", nullable = false)
    private String titulo;

    @Column(name = "descricao")
    private String descricao;

    @ManyToOne
    @JoinColumn(name = "id_instrutor", nullable = false)
    private Usuario instrutor;

    @ManyToOne
    @JoinColumn(name = "id_categoria", nullable = false)
    private Categoria categoria;

    @Column(name = "nivel")
    private String nivel;

    @Column(name = "data_publicacao")
    private LocalDate dataPublicacao;

    @Column(name = "total_aulas")
    private Integer totalAulas;

    @Column(name = "total_horas")
    private Integer totalHoras;

    @Column(name = "imagem_key")
    private String imagemKey;
}
