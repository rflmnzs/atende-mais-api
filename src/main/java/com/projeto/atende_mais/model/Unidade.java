package com.projeto.atende_mais.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "unidade")
public class Unidade {

    public enum Tipo {
        UBS, UPA, HOSPITAL
    }

    @Id
    @Column(name = "id", length = 50)
    private String id;

    @Column(name = "cnes", length = 50, unique = true)
    private String cnes;

    @Column(name = "nome_oficial", length = 255, nullable = false)
    private String nomeOficial;

    @Column(name = "nome_popular", length = 255)
    private String nomePopular;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo", nullable = false)
    private Tipo tipo;

    @Column(name = "lat", nullable = false)
    private Double lat;

    @Column(name = "lng", nullable = false)
    private Double lng;

    @Column(name = "endereco", length = 255, nullable = false)
    private String endereco;

    @Column(name = "bairro", length = 100)
    private String bairro;

    @Column(name = "telefone", length = 20)
    private String telefone;

    @Column(name = "ativo", nullable = false)
    private Boolean ativo = true;

    @Column(name = "fonte", length = 50, nullable = false)
    private String fonte;

    @Column(name = "verificado_em", nullable = false)
    private LocalDate verificadoEm;

    @OneToMany(mappedBy = "unidade")
    private List<Horario> horarios = new ArrayList<>();

    @OneToMany(mappedBy = "unidade")
    private List<Servico> servicos = new ArrayList<>();

    @OneToMany(mappedBy = "unidade")
    private List<Espera> esperas = new ArrayList<>();

    public Unidade() {
    }

    public Unidade(String id, String cnes, String nomeOficial, String nomePopular,
                   Tipo tipo, Double lat, Double lng, String endereco, String bairro,
                   String telefone, Boolean ativo, String fonte, LocalDate verificadoEm) {
        this.id = id;
        this.cnes = cnes;
        this.nomeOficial = nomeOficial;
        this.nomePopular = nomePopular;
        this.tipo = tipo;
        this.lat = lat;
        this.lng = lng;
        this.endereco = endereco;
        this.bairro = bairro;
        this.telefone = telefone;
        this.ativo = ativo;
        this.fonte = fonte;
        this.verificadoEm = verificadoEm;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getCnes() { return cnes; }
    public void setCnes(String cnes) { this.cnes = cnes; }
    public String getNomeOficial() { return nomeOficial; }
    public void setNomeOficial(String nomeOficial) { this.nomeOficial = nomeOficial; }
    public String getNomePopular() { return nomePopular; }
    public void setNomePopular(String nomePopular) { this.nomePopular = nomePopular; }
    public Tipo getTipo() { return tipo; }
    public void setTipo(Tipo tipo) { this.tipo = tipo; }
    public Double getLat() { return lat; }
    public void setLat(Double lat) { this.lat = lat; }
    public Double getLng() { return lng; }
    public void setLng(Double lng) { this.lng = lng; }
    public String getEndereco() { return endereco; }
    public void setEndereco(String endereco) { this.endereco = endereco; }
    public String getBairro() { return bairro; }
    public void setBairro(String bairro) { this.bairro = bairro; }
    public String getTelefone() { return telefone; }
    public void setTelefone(String telefone) { this.telefone = telefone; }
    public Boolean getAtivo() { return ativo; }
    public void setAtivo(Boolean ativo) { this.ativo = ativo; }
    public String getFonte() { return fonte; }
    public void setFonte(String fonte) { this.fonte = fonte; }
    public LocalDate getVerificadoEm() { return verificadoEm; }
    public void setVerificadoEm(LocalDate verificadoEm) { this.verificadoEm = verificadoEm; }
    public List<Horario> getHorarios() { return horarios; }
    public void setHorarios(List<Horario> horarios) { this.horarios = horarios; }
    public List<Servico> getServicos() { return servicos; }
    public void setServicos(List<Servico> servicos) { this.servicos = servicos; }
    public List<Espera> getEsperas() { return esperas; }
    public void setEsperas(List<Espera> esperas) { this.esperas = esperas; }
}
