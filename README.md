# 🏥 Atende+ Diadema

![Status do Projeto](https://img.shields.io/badge/status-MVP_Conclu%C3%ADdo-success)
![Versão](https://img.shields.io/badge/vers%C3%A3o-1.0-blue)

O **Atende+** é uma solução de logística de saúde *Mobile First* desenvolvida para orientar os cidadãos de Diadema (SP) sobre a rede municipal do SUS. O sistema localiza unidades de saúde próximas (UBS, UPA e Hospital), fornece estimativas de tempo de deslocação através do cálculo da Fórmula de Haversine e monitoriza os níveis da fila de espera e serviços disponíveis em tempo real.

O grande diferencial do projeto é o seu foco em **Alta Acessibilidade e UX/UI para Idosos**, integrando leitura de informações em voz alta (*Text-to-Speech*), alto contraste visual e integração direta de rotas com o Google Maps.

## 🎯 Principais Funcionalidades

- **Geolocalização Inteligente:** Utiliza a API nativa do navegador para encontrar a posição do utilizador e calcular a distância linear até todas as unidades de saúde registadas, ordenando-as da mais próxima para a mais distante.
- **Filtro de Serviços (Especialidades):** Permite filtrar rapidamente a rede de atendimento por serviços específicos como Pediatria, Odontologia, Farmácia ou Emergência.
- **Monitorização de Fila:** Indicadores visuais claros (Verde, Amarelo, Vermelho) informando a situação atual das filas em cada unidade.
- **Acessibilidade Universal (Text-to-Speech):** Sistema de voz integrado que lê em alto e bom som (PT-BR) o nome da unidade, distância estimada e estado da fila, facilitando o uso por pessoas com dificuldades visuais.
- **Integração de Rotas:** Botão dedicado que abre o destino diretamente no aplicativo do Google Maps para navegação GPS assistida.

## 💻 Tecnologias Utilizadas

O projeto foi construído sob uma arquitetura de Monorepo Full-Stack, utilizando as seguintes tecnologias:

### Back-end (API RESTful)
- **Linguagem:** Java 21
- **Framework:** Spring Boot
- **Persistência e ORM:** Spring Data JPA / Hibernate
- **Banco de Dados:** MySQL (Tabelas Relacionais: *Unidade, Servico, Espera*)
- **Arquitetura:** Camadas (Controller, Service, Repository, DTO, Model)
- **CORS:** Configurado para acesso do front-end.

### Front-end (Interface Web)
- **Estrutura:** HTML5 Semântico
- **Estilização:** CSS3 puro (*Mobile First*, Variáveis CSS, Fonte Inter)
- **Lógica e Integração:** JavaScript (Vanilla JS, Fetch API, `navigator.geolocation`, `window.speechSynthesis`)

## 🚀 Como Executar o Projeto Localmente

### Pré-requisitos
- Java Development Kit (JDK) 21 instalado.
- MySQL Server rodando localmente (porta 3306).
- IDE (VS Code, IntelliJ, Eclipse).

### Configuração do Banco de Dados
1. No MySQL Workbench, crie o esquema: `CREATE SCHEMA logistica_saude;`
2. No ficheiro `src/main/resources/application.properties`, configure as credenciais do seu banco de dados:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/logistica_saude
   spring.datasource.username=seu_usuario
   spring.datasource.password=sua_senha
   spring.jpa.hibernate.ddl-auto=update
