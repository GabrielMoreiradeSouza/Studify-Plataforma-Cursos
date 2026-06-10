package com.br.gabriel.api.service;

import com.br.gabriel.api.dto.request.RegisterRequest;
import com.br.gabriel.api.dto.request.SignInRequest;
import com.br.gabriel.api.dto.response.SignInResponse;
import com.br.gabriel.api.entity.Usuario;
import com.br.gabriel.api.entity.UsuarioRole;
import com.br.gabriel.api.exception.DuplicateUserDataException;
import com.br.gabriel.api.exception.IncorrectPasswordException;
import com.br.gabriel.api.exception.UserNotFoundException;
import com.br.gabriel.api.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@RequiredArgsConstructor
@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenService jwtTokenService;

    public SignInResponse signIn(SignInRequest request) {
        String email = request.email().trim().toLowerCase();

        // Verificar se o usuário existe
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("Usuário não encontrado."));

        // Verificar se a conta está desativada
//        if (usuario.getDeletedAt() != null) {
//            throw new AccountDisabledException("Esta conta foi desativada e não pode ser utilizada.");
//        }

        // Verificar se a senha está correta
        if (!passwordEncoder.matches(request.senhaHash(), usuario.getSenhaHash())) {
            throw new IncorrectPasswordException("Senha incorreta.");
        }

        // Se tudo estiver ok, gerar token
        return buildToken(usuario);
    }

    @Transactional
    public SignInResponse register(RegisterRequest request) {
        String email = request.email().trim().toLowerCase();

        if (usuarioRepository.existsByEmailIgnoreCase(email)) {
            throw new DuplicateUserDataException("O e-mail informado já pertence a outro usuário.");
        }

        Usuario usuario = new Usuario();
        usuario.setNomeCompleto(request.nomeCompleto());
        usuario.setEmail(email);
        usuario.setSenhaHash(passwordEncoder.encode(request.senhaHash()));
        usuario.setRole(request.role() != null ? request.role() : UsuarioRole.USER);
        usuario.setSaldo(BigDecimal.valueOf(500));

        usuario = usuarioRepository.save(usuario);
        return buildToken(usuario);
    }

    private SignInResponse buildToken(Usuario usuario) {
        return new SignInResponse(
                jwtTokenService.generateToken(usuario),
                usuario.getNomeCompleto(),
                usuario.getEmail(),
                usuario.getIdUsuario(),
                usuario.getRole()
        );
    }
}
