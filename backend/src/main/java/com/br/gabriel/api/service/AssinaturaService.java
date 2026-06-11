package com.br.gabriel.api.service;

import com.br.gabriel.api.dto.response.CarteiraResponse;
import com.br.gabriel.api.entity.Assinatura;
import com.br.gabriel.api.entity.Plano;
import com.br.gabriel.api.entity.Usuario;
import com.br.gabriel.api.exception.ResourceNotFoundException;
import com.br.gabriel.api.repository.AssinaturaRepository;
import com.br.gabriel.api.repository.PlanoRepository;
import com.br.gabriel.api.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Service
public class AssinaturaService {

    private final AssinaturaRepository assinaturaRepository;
    private final PlanoRepository planoRepository;
    private final UsuarioRepository usuarioRepository;

    public AssinaturaService(AssinaturaRepository assinaturaRepository, PlanoRepository planoRepository, UsuarioRepository usuarioRepository) {
        this.assinaturaRepository = assinaturaRepository;
        this.planoRepository = planoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    public CarteiraResponse getSaldo(Usuario usuario) {
        return new CarteiraResponse(usuario.getIdUsuario(), usuario.getSaldo());
    }

    @Transactional
    public CarteiraResponse comprarPlano(Usuario usuario, UUID planoId, String metodoPagamento) {
        Usuario managed = usuarioRepository.findById(usuario.getIdUsuario())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario nao encontrado"));

        Plano plano = planoRepository.findById(planoId)
                .orElseThrow(() -> new ResourceNotFoundException("Plano nao encontrado"));

        if (managed.getSaldo().compareTo(plano.getPreco()) < 0) {
            throw new RuntimeException("Saldo insuficiente para comprar este plano");
        }

        managed.setSaldo(managed.getSaldo().subtract(plano.getPreco()));
        usuarioRepository.save(managed);

        LocalDate hoje = LocalDate.now();
        Assinatura assinatura = new Assinatura();
        assinatura.setUsuario(managed);
        assinatura.setPlano(plano);
        assinatura.setDataInicio(hoje);
        assinatura.setDataFim(hoje.plusMonths(plano.getDuracaoMeses()));
        assinatura = assinaturaRepository.save(assinatura);

        return new CarteiraResponse(managed.getIdUsuario(), managed.getSaldo());
    }

    public boolean possuiAssinaturaAtiva(Usuario usuario) {
        return assinaturaRepository.existsByUsuario_IdUsuarioAndDataFimGreaterThanEqual(
                usuario.getIdUsuario(), LocalDate.now());
    }
}
