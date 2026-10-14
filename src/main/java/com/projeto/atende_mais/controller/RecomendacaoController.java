package com.projeto.atende_mais.controller;

import com.projeto.atende_mais.dto.RecomendacaoResponseDTO;
import com.projeto.atende_mais.repository.UnidadeRepository;
import com.projeto.atende_mais.service.RecomendacaoService;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Comparator;
import java.util.List;

@RestController
@RequestMapping("/api/recomendacoes")
@CrossOrigin(origins = "*")

public class RecomendacaoController {

    private static final double VELOCIDADE_MEDIA_KMH = 20.0;

    private final RecomendacaoService recomendacaoService;
    private final UnidadeRepository unidadeRepository;

    public RecomendacaoController(RecomendacaoService recomendacaoService,
                                  UnidadeRepository unidadeRepository) {
        this.recomendacaoService = recomendacaoService;
        this.unidadeRepository = unidadeRepository;
    }

    @GetMapping
    public List<RecomendacaoResponseDTO> recomendar(
            @RequestParam double lat,
            @RequestParam double lng,
            @RequestParam(required = false) String servico) {

        return unidadeRepository.findByAtivoTrue().stream()
                .map(unidade -> recomendacaoService.criarRecomendacao(
                        unidade,
                        lat,
                        lng,
                        VELOCIDADE_MEDIA_KMH
                ))
                .filter(dto -> correspondeAoServico(dto, servico))
                .sorted(Comparator.comparingDouble(RecomendacaoResponseDTO::distanciaKm))
                .toList();
    }

    private boolean correspondeAoServico(RecomendacaoResponseDTO dto, String servico) {
        if (servico == null || servico.isBlank()) {
            return true;
        }

        return dto.servicosDisponiveis().stream()
                .anyMatch(codigo -> codigo.equalsIgnoreCase(servico.trim()));
    }
}
