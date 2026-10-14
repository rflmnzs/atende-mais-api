USE logistica_saude;

START TRANSACTION;

-- Limpa os dados relacionados primeiro, pois as tabelas possuem chaves
-- estrangeiras que referenciam unidade.
DELETE FROM espera;
DELETE FROM horario;
DELETE FROM servico;
DELETE FROM unidade;

INSERT INTO unidade (
    id,
    cnes,
    nome_oficial,
    nome_popular,
    tipo,
    lat,
    lng,
    endereco,
    bairro,
    ativo,
    fonte,
    verificado_em
) VALUES
    (
        'upa-centro',
        '100001',
        'UPA CENTRO',
        'UPA Centro',
        'UPA',
        -23.6811,
        -46.6215,
        'Rua Tiradentes, 100 - Centro',
        'Centro',
        TRUE,
        'PREFEITURA',
        '2026-10-14'
    ),
    (
        'hospital-municipal-diadema',
        '100002',
        'HOSPITAL MUNICIPAL DE DIADEMA',
        'Hospital Municipal de Diadema',
        'HOSPITAL',
        -23.6750,
        -46.6000,
        'Av. Piraporinha, 1682 - Vila Nogueira',
        'Vila Nogueira',
        TRUE,
        'PREFEITURA',
        '2026-10-14'
    ),
    (
        'pa-eldorado',
        '100003',
        'PA ELDORADO',
        'PA Eldorado',
        'UPA',
        -23.7150,
        -46.6130,
        'Av. Nossa Sra. dos Navegantes, 288 - Eldorado',
        'Eldorado',
        TRUE,
        'PREFEITURA',
        '2026-10-14'
    ),
    (
        'upa-paineiras',
        '100004',
        'UPA PAINEIRAS',
        'UPA Paineiras',
        'UPA',
        -23.6850,
        -46.6110,
        'Rua Javari, 635 - Jardim Paineiras',
        'Jardim Paineiras',
        TRUE,
        'PREFEITURA',
        '2026-10-14'
    ),
    (
        'ubs-eldorado',
        '100005',
        'UBS ELDORADO',
        'UBS Eldorado',
        'UBS',
        -23.7145,
        -46.6135,
        'Av. Nossa Sra. dos Navegantes, 200 - Eldorado',
        'Eldorado',
        TRUE,
        'PREFEITURA',
        '2026-10-14'
    ),
    (
        'ubs-centro',
        '100006',
        'UBS CENTRO',
        'UBS Centro',
        'UBS',
        -23.6830,
        -46.6250,
        'Av. São José, 472 - Centro',
        'Centro',
        TRUE,
        'PREFEITURA',
        '2026-10-14'
    ),
    (
        'ubs-jardim-das-nacoes',
        '100007',
        'UBS JARDIM DAS NAÇÕES',
        'UBS Jardim das Nações',
        'UBS',
        -23.6780,
        -46.6150,
        'Rua Itália, 290 - Jardim das Nações',
        'Jardim das Nações',
        TRUE,
        'PREFEITURA',
        '2026-10-14'
    ),
    (
        'ubs-jardim-abc',
        '100008',
        'UBS JARDIM ABC',
        'UBS Jardim ABC',
        'UBS',
        -23.6990,
        -46.6100,
        'Av. das Ameixeiras, 679 - Jardim ABC',
        'Jardim ABC',
        TRUE,
        'PREFEITURA',
        '2026-10-14'
    ),
    (
        'ubs-inamar',
        '100009',
        'UBS JARDIM INAMAR',
        'UBS Jardim Inamar',
        'UBS',
        -23.7100,
        -46.5980,
        'Rua José Vicente, 100 - Jardim Inamar',
        'Jardim Inamar',
        TRUE,
        'PREFEITURA',
        '2026-10-14'
    ),
    (
        'ubs-vila-paulina',
        '100010',
        'UBS VILA PAULINA',
        'UBS Vila Paulina',
        'UBS',
        -23.7250,
        -46.5900,
        'Av. Afrânio Peixoto, 643 - Vila Paulina',
        'Vila Paulina',
        TRUE,
        'PREFEITURA',
        '2026-10-14'
    );

COMMIT;
