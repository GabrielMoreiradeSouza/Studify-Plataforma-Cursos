package com.br.gabriel.api.service;

import com.br.gabriel.api.dto.request.UpdateUsuarioRequest;
import com.br.gabriel.api.dto.response.SignInResponse;
import com.br.gabriel.api.entity.Usuario;
import com.br.gabriel.api.exception.ResourceNotFoundException;
import com.br.gabriel.api.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.UUID;

@Service
public class UsuarioService {
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenService jwtTokenService;

    public UsuarioService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder, JwtTokenService jwtTokenService) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenService = jwtTokenService;
    }


    public Usuario findById(UUID id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado com esse Id"));
    }

    @Transactional
    public SignInResponse update(UUID id, UpdateUsuarioRequest request){
        Usuario usuario = findById(id);

        if(request.nomeCompleto() != null){
            usuario.setNomeCompleto(request.nomeCompleto().trim());
        }

        if(request.email() != null){
            usuario.setEmail(request.email().trim());
        }

        if(request.senhaHash() != null){
            usuario.setSenhaHash(passwordEncoder.encode(request.senhaHash()));
        }

        usuario = usuarioRepository.save(usuario);

        return new SignInResponse(
                jwtTokenService.generateToken(usuario),
                usuario.getNomeCompleto(),
                usuario.getEmail(),
                usuario.getIdUsuario()
        );
    }
}