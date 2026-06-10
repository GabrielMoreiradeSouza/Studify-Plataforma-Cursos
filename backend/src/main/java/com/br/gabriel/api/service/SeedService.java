package com.br.gabriel.api.service;

import com.br.gabriel.api.entity.Categoria;
import com.br.gabriel.api.entity.Plano;
import com.br.gabriel.api.entity.Usuario;
import com.br.gabriel.api.entity.UsuarioRole;
import com.br.gabriel.api.repository.CategoriaRepository;
import com.br.gabriel.api.repository.PlanoRepository;
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
    private final PlanoRepository planoRepository;

    public SeedService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder, CategoriaRepository categoriaRepository, PlanoRepository planoRepository) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.categoriaRepository = categoriaRepository;
        this.planoRepository = planoRepository;
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
    public void seedPlanos() {
        if (planoRepository.count() == 0) {
            Plano mensal = new Plano();
            mensal.setNome("Mensal");
            mensal.setDescricao("1 Mês de Acesso a Todos os Cursos");
            mensal.setPreco(new java.math.BigDecimal("120"));
            mensal.setDuracaoMeses(1);
            planoRepository.save(mensal);

            Plano anual = new Plano();
            anual.setNome("Anual");
            anual.setDescricao("12 Meses de Acesso a Todos os Cursos");
            anual.setPreco(new java.math.BigDecimal("468"));
            anual.setDuracaoMeses(12);
            planoRepository.save(anual);

            Plano vitalicio = new Plano();
            vitalicio.setNome("Vitalício");
            vitalicio.setDescricao("Acesso Vitalício Ilimitado a Todos os Cursos");
            vitalicio.setPreco(new java.math.BigDecimal("540"));
            vitalicio.setDuracaoMeses(999);
            planoRepository.save(vitalicio);

            log.info("Planos seeded: Mensal, Anual, Vitalicio");
        } else {
            log.info("Planos already exist, skipping seed.");
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
