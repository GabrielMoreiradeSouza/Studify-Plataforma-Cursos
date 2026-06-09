package com.br.gabriel.api.service;

import com.br.gabriel.api.entity.Categoria;
import com.br.gabriel.api.entity.Usuario;
import com.br.gabriel.api.entity.UsuarioRole;
import com.br.gabriel.api.repository.CategoriaRepository;
import com.br.gabriel.api.repository.UsuarioRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SeedService {

    private static final Logger log = LoggerFactory.getLogger(SeedService.class);

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final CategoriaRepository categoriaRepository;

    public SeedService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder, CategoriaRepository categoriaRepository) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.categoriaRepository = categoriaRepository;
    }

    @Transactional
    public void seedAdmin() {
        if (usuarioRepository.findByEmail("admin@email.com").isEmpty()) {
            Usuario admin = new Usuario();
            admin.setNomeCompleto("AdminUser");
            admin.setEmail("admin@email.com");
            admin.setSenhaHash(passwordEncoder.encode("admin123"));
            admin.setRole(UsuarioRole.ADMIN);
            usuarioRepository.save(admin);
            log.info("Admin user created: admin@email.com");
        } else {
            log.info("Admin user already exists, skipping seed.");
        }
    }

    @Transactional
    public void seedCategorias() {
        if (categoriaRepository.count() == 0) {
            Categoria web = new Categoria();
            web.setNome("Desenvolvimento Web");
            web.setDescricao("Cursos de desenvolvimento web");
            categoriaRepository.save(web);

            Categoria design = new Categoria();
            design.setNome("UX/UI Design");
            design.setDescricao("Cursos de design de interface e experiência do usuário");
            categoriaRepository.save(design);

            Categoria mobile = new Categoria();
            mobile.setNome("Mobile");
            mobile.setDescricao("Cursos de desenvolvimento mobile");
            categoriaRepository.save(mobile);

            log.info("Categorias seeded: {}, {}, {}", web.getNome(), design.getNome(), mobile.getNome());
        } else {
            log.info("Categorias already exist, skipping seed.");
        }
    }
}
