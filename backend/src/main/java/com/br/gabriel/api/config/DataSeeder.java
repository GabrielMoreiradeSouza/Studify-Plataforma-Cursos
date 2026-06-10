package com.br.gabriel.api.config;

import com.br.gabriel.api.service.SeedService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    private final SeedService seedService;

    public DataSeeder(SeedService seedService) {
        this.seedService = seedService;
    }

    @Override
    public void run(String... args) {
        try {
            seedService.seedAdmin();
        } catch (Exception e) {
            log.error("Failed to seed admin user: {}", e.getMessage(), e);
        }
        try {
            seedService.seedCategorias();
        } catch (Exception e) {
            log.error("Failed to seed categorias: {}", e.getMessage(), e);
        }
        try {
            seedService.seedPlanos();
        } catch (Exception e) {
            log.error("Failed to seed planos: {}", e.getMessage(), e);
        }
    }
}
