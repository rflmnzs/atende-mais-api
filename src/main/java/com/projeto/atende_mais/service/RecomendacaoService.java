package com.projeto.atende_mais.service;

import com.projeto.atende_mais.dto.RecomendacaoResponseDTO;
import com.projeto.atende_mais.dto.EquipeAtivaDTO;
import com.projeto.atende_mais.model.Espera;
import com.projeto.atende_mais.model.Servico;
import com.projeto.atende_mais.model.Unidade;
import com.projeto.atende_mais.repository.EsperaRepository;
import com.projeto.atende_mais.repository.ServicoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Locale;

@Service
public class RecomendacaoService {

    private static final double RAIO_TERRA_KM = 6371.0;
    private static final double FATOR_ROTA_URBANA = 1.3;

    private final EsperaRepository esperaRepository;
    private final ServicoRepository servicoRepository;

    public RecomendacaoService(EsperaRepository esperaRepository,
                               ServicoRepository servicoRepository) {
        this.esperaRepository = esperaRepository;
        this.servicoRepository = servicoRepository;
    }

    public RecomendacaoResponseDTO criarRecomendacao(Unidade unidade,
                                                      double latitudeUsuario,
                                                      double longitudeUsuario,
                                                      double velocidadeKmh) {
        double distanciaKm = calcularDistancia(
                latitudeUsuario,
                longitudeUsuario,
                unidade.getLat(),
                unidade.getLng()
        );

        int tempoEstimadoMinutos = calcularTempoDeslocamentoMinutos(
                distanciaKm,
                velocidadeKmh
        );

        return new RecomendacaoResponseDTO(
                unidade.getNomeOficial(),
                unidade.getTipo(),
                distanciaKm,
                tempoEstimadoMinutos,
                buscarNivelFilaAtual(unidade.getId()),
                buscarServicosDisponiveis(unidade.getId()),
                estimarEsperaAtendimento(unidade),
                estimarEquipeAtiva(unidade)
        );
    }

    /**
     * Valores demonstrativos para a PoC. Não representam monitoramento oficial
     * e não são persistidos no banco de dados.
     */
    private int estimarEsperaAtendimento(Unidade unidade) {
        int variacao = Math.floorMod(unidade.getId().hashCode(), 16);
        return switch (unidade.getTipo()) {
            case UBS -> 15 + variacao;
            case UPA -> 30 + variacao * 2;
            case HOSPITAL -> 45 + variacao * 2;
        };
    }

    /** Valores demonstrativos apenas para tornar a capacidade da unidade compreensível. */
    private EquipeAtivaDTO estimarEquipeAtiva(Unidade unidade) {
        int variacao = Math.floorMod(unidade.getId().hashCode(), 4);
        return switch (unidade.getTipo()) {
            case UBS -> new EquipeAtivaDTO(2 + variacao % 2, 2 + variacao, 1 + variacao % 2);
            case UPA -> new EquipeAtivaDTO(3 + variacao % 2, 5 + variacao, 3 + variacao % 2);
            case HOSPITAL -> new EquipeAtivaDTO(5 + variacao % 2, 10 + variacao, 6 + variacao % 2);
        };
    }

    public double calcularDistancia(double lat1, double lon1, double lat2, double lon2) {
        // A fórmula de Haversine calcula a distância sobre a superfície de uma esfera.
        // Primeiro, convertemos as coordenadas e suas diferenças de graus para radianos.
        double lat1Rad = Math.toRadians(lat1);
        double lat2Rad = Math.toRadians(lat2);
        double diferencaLat = Math.toRadians(lat2 - lat1);
        double diferencaLon = Math.toRadians(lon2 - lon1);

        // "a" representa o quadrado de metade da distância angular entre os pontos.
        double a = Math.pow(Math.sin(diferencaLat / 2), 2)
                + Math.cos(lat1Rad) * Math.cos(lat2Rad)
                * Math.pow(Math.sin(diferencaLon / 2), 2);

        // "c" é o ângulo central; multiplicá-lo pelo raio fornece a distância em km.
        double aLimitado = Math.max(0, Math.min(1, a));
        double c = 2 * Math.atan2(Math.sqrt(aLimitado), Math.sqrt(1 - aLimitado));
        return RAIO_TERRA_KM * c;
    }

    public int calcularTempoDeslocamentoMinutos(double distanciaKm, double velocidadeKmh) {
        if (distanciaKm < 0) {
            throw new IllegalArgumentException("A distância não pode ser negativa.");
        }
        if (velocidadeKmh <= 0) {
            throw new IllegalArgumentException("A velocidade deve ser maior que zero.");
        }

        // Corrigimos a distância para uma rota urbana, calculamos as horas e convertemos
        // para minutos. O teto evita subestimar um deslocamento com minutos fracionários.
        double tempoMinutos = (distanciaKm * FATOR_ROTA_URBANA / velocidadeKmh) * 60;
        return (int) Math.ceil(tempoMinutos);
    }

    private String buscarNivelFilaAtual(String unidadeId) {
        return esperaRepository.findTopByUnidadeIdOrderByMedidoEmDesc(unidadeId)
                .map(Espera::getNivel)
                .map(nivel -> nivel.name().toUpperCase(Locale.ROOT))
                .orElse("DESCONHECIDO");
    }

    private List<String> buscarServicosDisponiveis(String unidadeId) {
        return servicoRepository.findByUnidadeId(unidadeId).stream()
                .map(Servico::getCodigo)
                .toList();
    }
}
