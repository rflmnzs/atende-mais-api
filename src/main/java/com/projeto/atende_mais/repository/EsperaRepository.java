package com.projeto.atende_mais.repository;

import com.projeto.atende_mais.model.Espera;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EsperaRepository extends JpaRepository<Espera, Long> {

    Optional<Espera> findTopByUnidadeIdOrderByMedidoEmDesc(String unidadeId);
}
