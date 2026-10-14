package com.projeto.atende_mais.repository;

import com.projeto.atende_mais.model.Unidade;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UnidadeRepository extends JpaRepository<Unidade, String> {

    List<Unidade> findByAtivoTrue();
}
