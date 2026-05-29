package com.br.gabriel.api.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@RequiredArgsConstructor
@AllArgsConstructor
@Entity
@Table (name = "users")
public class Users {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "name", nullable = false)
    private String name;
    @Column (name = "email", nullable = false, unique = true)
    private String email;
    @Column (name = "password", nullable = false)
    private String password;
    @Column (name = "data_cadastro", nullable = false)
    private LocalDateTime dataCadastro;
}
