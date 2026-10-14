package com.projeto.atende_mais.dto;

import com.projeto.atende_mais.model.Unidade;

import java.util.List;

public record RecomendacaoResponseDTO(
        String nomeUnidade,
        Unidade.Tipo tipo,
        double distanciaKm,
        int tempoEstimadoMinutos,
        String nivelFila,
        List<String> servicosDisponiveis
) {
}
