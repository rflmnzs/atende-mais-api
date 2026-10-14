package com.projeto.atende_mais.repository;

import com.projeto.atende_mais.model.Horario;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HorarioRepository extends JpaRepository<Horario, Long> {
}
