package com.projeto.atende_mais.repository;

import com.projeto.atende_mais.model.Servico;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ServicoRepository extends JpaRepository<Servico, Long> {

    List<Servico> findByUnidadeId(String unidadeId);
}
