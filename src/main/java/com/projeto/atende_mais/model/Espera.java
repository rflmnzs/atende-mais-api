package com.projeto.atende_mais.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

@Entity
@Table(name = "espera")
public class Espera {

    public enum Nivel {
        baixo, medio, alto
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "unidade_id")
    private Unidade unidade;

    @Column(name = "medido_em", nullable = false)
    private LocalDateTime medidoEm;

    @Column(name = "espera_min")
    private Integer esperaMin;

    @Enumerated(EnumType.STRING)
    @Column(name = "nivel")
    private Nivel nivel;

    @Column(name = "origem", length = 50, nullable = false)
    private String origem;

    public Espera() {
    }

    public Espera(Unidade unidade, LocalDateTime medidoEm, Integer esperaMin,
                  Nivel nivel, String origem) {
        this.unidade = unidade;
        this.medidoEm = medidoEm;
        this.esperaMin = esperaMin;
        this.nivel = nivel;
        this.origem = origem;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Unidade getUnidade() { return unidade; }
    public void setUnidade(Unidade unidade) { this.unidade = unidade; }
    public LocalDateTime getMedidoEm() { return medidoEm; }
    public void setMedidoEm(LocalDateTime medidoEm) { this.medidoEm = medidoEm; }
    public Integer getEsperaMin() { return esperaMin; }
    public void setEsperaMin(Integer esperaMin) { this.esperaMin = esperaMin; }
    public Nivel getNivel() { return nivel; }
    public void setNivel(Nivel nivel) { this.nivel = nivel; }
    public String getOrigem() { return origem; }
    public void setOrigem(String origem) { this.origem = origem; }
}
