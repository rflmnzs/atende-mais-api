package com.projeto.atende_mais.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import java.time.LocalTime;

@Entity
@Table(name = "horario")
public class Horario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "unidade_id")
    private Unidade unidade;

    @Column(name = "dia_semana")
    private Integer diaSemana;

    @Column(name = "abre", nullable = false)
    private LocalTime abre;

    @Column(name = "fecha", nullable = false)
    private LocalTime fecha;

    public Horario() {
    }

    public Horario(Unidade unidade, Integer diaSemana, LocalTime abre, LocalTime fecha) {
        this.unidade = unidade;
        this.diaSemana = diaSemana;
        this.abre = abre;
        this.fecha = fecha;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Unidade getUnidade() { return unidade; }
    public void setUnidade(Unidade unidade) { this.unidade = unidade; }
    public Integer getDiaSemana() { return diaSemana; }
    public void setDiaSemana(Integer diaSemana) { this.diaSemana = diaSemana; }
    public LocalTime getAbre() { return abre; }
    public void setAbre(LocalTime abre) { this.abre = abre; }
    public LocalTime getFecha() { return fecha; }
    public void setFecha(LocalTime fecha) { this.fecha = fecha; }
}
