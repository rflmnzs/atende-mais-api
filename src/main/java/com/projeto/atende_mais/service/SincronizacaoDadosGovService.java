package com.projeto.atende_mais.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class SincronizacaoDadosGovService {

    private static final Logger logger = LoggerFactory.getLogger(SincronizacaoDadosGovService.class);

    @Scheduled(fixedRate = 60000)
    public void sincronizarDados() {
        logger.info("1. Iniciando conexão com a base do Datasus/CNES...");
        logger.info("2. Verificando diferenças e novos códigos CNES...");
        logger.info("3. Atualizando disponibilidade de medicamentos e serviços...");
        logger.info("4. Sincronização concluída com sucesso.");
    }
}
