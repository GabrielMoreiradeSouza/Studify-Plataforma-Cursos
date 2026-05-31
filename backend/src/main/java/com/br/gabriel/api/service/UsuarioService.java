package com.br.gabriel.api.service;

import com.br.gabriel.api.entity.Usuario;
import com.br.gabriel.api.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class UsuarioService {
    private final UsuarioRepository usuarioRepository;

    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
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

        if(request.senha() != null){
            usuario.setSenhaHash(passwordEncoder.encode(request.senhaHash()));
        }

        usuario = usuarioRepository.save(usuario);

        return new SigInResponse(
                usuario.getIdUsuario(),
                usuario.getNomeCompleto(),
                usuario.getEmail(),

                List.of()
        );
    }
}