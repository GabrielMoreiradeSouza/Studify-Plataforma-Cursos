package com.br.gabriel.api.service;

import com.br.gabriel.api.dto.response.PlanoResponse;
import com.br.gabriel.api.repository.PlanoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PlanoService {

    private final PlanoRepository planoRepository;

    public PlanoService(PlanoRepository planoRepository) {
        this.planoRepository = planoRepository;
    }

    public List<PlanoResponse> listAll() {
        return planoRepository.findAll().stream()
                .map(p -> new PlanoResponse(p.getIdPlano(), p.getNome(), p.getDescricao(), p.getPreco(), p.getDuracaoMeses()))
                .toList();
    }
}
