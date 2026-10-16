import { ApiClient } from "./api-client.js";

const botaoBuscar = document.querySelector("#buscar-unidades");
const textoBuscar = document.querySelector("#buscar-texto");
const botoesFiltro = document.querySelectorAll(".filtro");
const resultadoContainer = document.querySelector("#resultado-container");
const resumoResultados = document.querySelector("#resumo-resultados");
const mensagemStatus = document.querySelector("#mensagem-status");
const loading = document.querySelector("#loading");
const loadingTexto = document.querySelector("#loading-texto");
const estadoVazio = document.querySelector("#estado-vazio");
const estadoTitulo = document.querySelector("#estado-titulo");
const estadoDescricao = document.querySelector("#estado-descricao");
const apiClient = new ApiClient();
const CONSULTA_GUARDADA_KEY = "atende-plus:ultima-consulta:v1";

let unidadesEncontradas = null;
let servicoSelecionado = "";
let carregando = false;
let falaAtual = null;
let botaoEmLeitura = null;
let consultaGuardadaEmUso = null;

const nomesServicos = new Map([
    ["CLINICA_GERAL", "Clínica Geral"],
    ["PEDIATRIA", "Pediatria"],
    ["ODONTOLOGIA", "Odontologia"],
    ["FARMACIA", "Farmácia"],
    ["EMERGENCIA", "Emergência"],
    ["VACINACAO", "Vacinação"],
    ["ATENCAO_BASICA", "Atenção Básica"]
]);

botaoBuscar.addEventListener("click", buscarUnidades);
botoesFiltro.forEach((botao) => botao.addEventListener("click", selecionarFiltro));
window.addEventListener("pagehide", pararLeitura);

if (!navigator.onLine && !restaurarConsulta()) {
    mostrarEstado("Sem ligação e sem consulta guardada", "Abra a aplicação com internet e faça uma busca para guardar unidades neste telemóvel.");
    resumoResultados.textContent = "Sem dados guardados";
}

function normalizarCodigo(texto) {
    return String(texto ?? "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim()
        .toUpperCase()
        .replace(/[\s_-]+/g, "_");
}

function formatarNomeServico(texto) {
    const codigo = normalizarCodigo(texto);
    if (!codigo) return "Serviço não informado";
    if (nomesServicos.has(codigo)) return nomesServicos.get(codigo);

    return String(texto).trim().replace(/[_\s-]+/g, " ")
        .toLocaleLowerCase("pt-BR")
        .split(" ")
        .map((palavra) => palavra.charAt(0).toLocaleUpperCase("pt-BR") + palavra.slice(1))
        .join(" ");
}

function obterServicos(unidade) {
    const servicos = Array.isArray(unidade.servicosDisponiveis)
        ? unidade.servicosDisponiveis
        : [];
    const unicos = new Map();
    servicos.forEach((servico) => {
        if (typeof servico !== "string" || !servico.trim()) return;
        unicos.set(normalizarCodigo(servico), servico.trim());
    });
    return [...unicos.values()];
}

function filtrarUnidades(unidades, servico) {
    const codigo = normalizarCodigo(servico);
    if (!codigo || codigo === "TODOS") return unidades;

    return unidades.filter((unidade) => obterServicos(unidade)
        .some((disponivel) => normalizarCodigo(disponivel) === codigo));
}

function selecionarFiltro(evento) {
    if (carregando) return;
    servicoSelecionado = evento.currentTarget.dataset.servico ?? "";
    botoesFiltro.forEach((botao) => {
        const ativo = botao === evento.currentTarget;
        botao.classList.toggle("ativo", ativo);
        botao.setAttribute("aria-pressed", String(ativo));
    });

    if (unidadesEncontradas !== null) {
        renderizarRecomendacoes();
    } else {
        buscarUnidades();
    }
}

async function buscarUnidades() {
    if (carregando) return;
    pararLeitura();
    unidadesEncontradas = null;
    consultaGuardadaEmUso = null;
    resultadoContainer.replaceChildren();
    exibirMensagem("");
    estadoVazio.hidden = true;
    resumoResultados.textContent = "Buscando unidades próximas";

    if (!navigator.onLine) {
        if (!restaurarConsulta()) {
            const mensagem = "Sem ligação. Faça uma busca com internet para guardar unidades neste telemóvel.";
            mostrarEstado("Sem ligação e sem consulta guardada", mensagem);
            resumoResultados.textContent = "Sem dados guardados";
            exibirMensagem(mensagem, true);
        }
        return;
    }

    definirCarregamento(true, "Obtendo sua localização…");

    try {
        const posicao = await obterLocalizacao();
        loadingTexto.textContent = "Buscando unidades próximas…";

        // Busca a lista completa. O filtro local funciona mesmo quando a API ignora servico.
        const unidades = await apiClient.buscarRecomendacoes(
            posicao.coords.latitude,
            posicao.coords.longitude
        );
        if (!Array.isArray(unidades) || unidades.some((unidade) => !unidade || typeof unidade !== "object")) {
            throw new Error("Não foi possível ler os dados das unidades. Tente novamente.");
        }

        unidadesEncontradas = unidades;
        salvarConsulta(unidades);
        renderizarRecomendacoes();
    } catch (erro) {
        if (!restaurarConsulta()) {
            const mensagem = mensagemDeErro(erro);
            mostrarEstado("Não foi possível concluir a busca", mensagem);
            resumoResultados.textContent = "Busca não concluída";
            exibirMensagem(mensagem, true);
        }
    } finally {
        await aguardarRenderizacao();
        definirCarregamento(false);
    }
}

function obterLocalizacao() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error("Este navegador não oferece localização. Tente em outro navegador."));
            return;
        }
        navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000
        });
    });
}

function mensagemDeErro(erro) {
    switch (erro?.code) {
        case 1: return "Permita o acesso à localização no navegador e tente novamente.";
        case 2: return "Sua localização está indisponível. Confira se ela está ativada e tente novamente.";
        case 3: return "A localização demorou para responder. Tente buscar novamente.";
        default: return "Não foi possível carregar as unidades. Confira sua conexão e tente novamente.";
    }
}

function salvarConsulta(unidades) {
    try {
        localStorage.setItem(CONSULTA_GUARDADA_KEY, JSON.stringify({
            versao: 1,
            consultadoEm: Date.now(),
            unidades
        }));
    } catch {
        // A consulta online continua mesmo se o armazenamento estiver indisponível.
    }
}

function restaurarConsulta() {
    try {
        const dados = JSON.parse(localStorage.getItem(CONSULTA_GUARDADA_KEY));
        if (dados?.versao !== 1 || !Number.isFinite(dados.consultadoEm) ||
                !Array.isArray(dados.unidades) ||
                dados.unidades.some((unidade) => !unidade || typeof unidade !== "object" || Array.isArray(unidade))) {
            return false;
        }

        consultaGuardadaEmUso = dados.consultadoEm;
        unidadesEncontradas = dados.unidades;
        renderizarRecomendacoes();
        return true;
    } catch {
        return false;
    }
}

function avisoConsultaGuardada() {
    const data = new Date(consultaGuardadaEmUso).toLocaleString("pt-BR", {
        dateStyle: "short",
        timeStyle: "short"
    });
    return `Consulta guardada em ${data}. Distâncias e tempos referem-se à localização daquela consulta.`;
}

function renderizarRecomendacoes() {
    pararLeitura();
    const unidades = filtrarUnidades(unidadesEncontradas ?? [], servicoSelecionado);
    const fragmento = document.createDocumentFragment();
    unidades.forEach((unidade, indice) => fragmento.append(criarCard(unidade, indice)));
    resultadoContainer.replaceChildren(fragmento);
    estadoVazio.hidden = unidades.length > 0;

    const quantidade = `${unidades.length} ${unidades.length === 1 ? "unidade encontrada" : "unidades encontradas"}`;
    const categoria = servicoSelecionado ? formatarNomeServico(servicoSelecionado) : "Todos os serviços";
    resumoResultados.textContent = `${quantidade} · ${categoria}`;
    exibirMensagem(
        consultaGuardadaEmUso === null
            ? `${quantidade}. ${categoria}.`
            : avisoConsultaGuardada(),
        false,
        consultaGuardadaEmUso !== null
    );

    if (unidades.length === 0) {
        const descricao = servicoSelecionado
            ? `Não encontramos unidades com ${formatarNomeServico(servicoSelecionado)} nesta busca. Escolha outro serviço ou selecione Todos.`
            : consultaGuardadaEmUso === null
                ? "Nenhuma unidade ativa foi encontrada. Tente buscar novamente mais tarde."
                : "Nenhuma unidade estava listada na última consulta guardada. Atualize quando tiver internet.";
        mostrarEstado("Nenhuma unidade encontrada", descricao);
    }
}

function formatarNomeUnidade(texto) {
    const nome = String(texto ?? "").trim();
    if (!nome) return "Unidade sem nome informado";
    const siglas = new Set(["UBS", "UPA", "PA", "SUS", "ABC"]);
    return nome.replace(/_/g, " ").split(/\s+/).map((palavra, indice) => {
        if (siglas.has(palavra.toUpperCase())) return palavra.toUpperCase();
        const minuscula = palavra.toLocaleLowerCase("pt-BR");
        if (indice > 0 && ["de", "da", "do", "das", "dos", "e"].includes(minuscula)) return minuscula;
        return minuscula.charAt(0).toLocaleUpperCase("pt-BR") + minuscula.slice(1);
    }).join(" ");
}

function numeroValido(valor) {
    if (valor === null || valor === undefined || String(valor).trim() === "") return null;
    const numero = Number(valor);
    return Number.isFinite(numero) && numero >= 0 ? numero : null;
}

function criarCard(unidade, indice) {
    const nomeUnidade = formatarNomeUnidade(unidade.nomeUnidade);
    const distancia = numeroValido(unidade.distanciaKm);
    const tempo = numeroValido(unidade.tempoEstimadoMinutos);
    const distanciaTexto = distancia === null ? "Não informada" : `${distancia.toFixed(2)} km`;
    const tempoTexto = tempo === null ? "Não informado" : `${Math.ceil(tempo)} min`;
    const nivelFila = normalizarNivelFila(unidade.nivelFila);
    const card = elemento("article", "unidade-card");
    const titulo = elemento("h3", "", nomeUnidade);
    titulo.id = `unidade-${indice}`;
    card.setAttribute("aria-labelledby", titulo.id);

    const cabecalho = elemento("div", "unidade-cabecalho");
    const iconeUnidade = elemento("span", "unidade-icone");
    iconeUnidade.append(criarIcone("unidade"));
    const identidade = elemento("div", "unidade-identidade");
    const tipo = String(unidade.tipo ?? "").trim();
    identidade.append(elemento("p", "unidade-tipo", tipo === "HOSPITAL" ? "Hospital" : tipo || "Unidade de saúde"), titulo);
    cabecalho.append(iconeUnidade, identidade);

    const detalhes = elemento("dl", "unidade-detalhes");
    detalhes.append(criarDetalhe("Distância", distanciaTexto), criarDetalhe("Deslocamento estimado", tempoTexto));
    const fila = elemento("p", `fila-badge fila-${nivelFila.classe}`, nivelFila.texto);
    const acoes = elemento("div", "card-acoes");
    const botaoOuvir = elemento("button", "botao-ouvir");
    botaoOuvir.type = "button";
    botaoOuvir.append(criarIcone("som"), elemento("span", "", "Ouvir"));
    botaoOuvir.dataset.rotulo = `Ouvir informações sobre ${nomeUnidade}`;
    botaoOuvir.setAttribute("aria-label", botaoOuvir.dataset.rotulo);
    botaoOuvir.addEventListener("click", () => {
        if (botaoEmLeitura === botaoOuvir) {
            pararLeitura();
            return;
        }
        const distanciaFalada = distancia === null ? "não informada" : `${distancia.toFixed(2).replace(".", ",")} quilômetros`;
        const tempoFalado = tempo === null ? "não informado" : `${Math.ceil(tempo)} minutos`;
        const texto = `${nomeUnidade}. Distância: ${distanciaFalada}. `
            + `Tempo estimado: ${tempoFalado}. Fila de espera: ${nivelFila.fala}.`;
        lerEmVozAlta(texto, botaoOuvir);
    });

    const rota = elemento("a", "tracar-rota");
    rota.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${nomeUnidade} Diadema`)}`;
    rota.target = "_blank";
    rota.rel = "noopener noreferrer";
    rota.setAttribute("aria-label", `Traçar rota para ${nomeUnidade} no Google Maps (nova aba)`);
    rota.append(criarIcone("rota"), elemento("span", "", "Traçar rota"));
    acoes.append(botaoOuvir, rota);
    card.append(cabecalho, detalhes, fila, criarListaServicos(unidade), acoes);
    return card;
}

function normalizarNivelFila(nivel) {
    switch (normalizarCodigo(nivel)) {
        case "BAIXO": return { classe: "baixo", texto: "Fila baixa · Rápido", fala: "baixa, atendimento rápido" };
        case "MEDIO": return { classe: "medio", texto: "Fila média · Moderado", fala: "média, espera moderada" };
        case "ALTO": return { classe: "alto", texto: "Fila alta · Demorado", fala: "alta, espera demorada" };
        default: return { classe: "desconhecido", texto: "Fila sem informação", fala: "desconhecida" };
    }
}

function criarListaServicos(unidade) {
    const secao = elemento("div", "servicos");
    secao.append(elemento("h4", "", "Serviços disponíveis"));
    const servicos = obterServicos(unidade);
    if (servicos.length === 0) {
        secao.append(elemento("p", "servicos-vazio", "Serviços não listados"));
        return secao;
    }
    const lista = elemento("ul", "servicos-lista");
    servicos.forEach((servico) => lista.append(elemento("li", "", formatarNomeServico(servico))));
    secao.append(lista);
    return secao;
}

function criarDetalhe(rotulo, valor) {
    const grupo = elemento("div");
    grupo.append(elemento("dt", "", rotulo), elemento("dd", "", valor));
    return grupo;
}

function elemento(tag, classe = "", texto = "") {
    const item = document.createElement(tag);
    if (classe) item.className = classe;
    if (texto) item.textContent = texto;
    return item;
}

function criarIcone(nome) {
    const caminhos = {
        unidade: ["M4 21V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v16", "M2 21h20M9 21v-6h6v6M9 8h6M12 5v6"],
        som: ["M11 5 6 9H3v6h3l5 4V5Z", "M15 8a6 6 0 0 1 0 8M18 5a10 10 0 0 1 0 14"],
        rota: ["m21 3-6 18-4-8-8-4 18-6Z", "m11 13 5-5"]
    };
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("class", "icone");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "1.7");
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("stroke-linejoin", "round");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    caminhos[nome].forEach((d) => {
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", d);
        svg.append(path);
    });
    return svg;
}

function pararLeitura() {
    falaAtual = null;
    if (botaoEmLeitura) {
        botaoEmLeitura.querySelector("span").textContent = "Ouvir";
        botaoEmLeitura.removeAttribute("aria-pressed");
        botaoEmLeitura.setAttribute("aria-label", botaoEmLeitura.dataset.rotulo);
    }
    botaoEmLeitura = null;
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
}

function lerEmVozAlta(texto, botao) {
    if (!("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) {
        exibirMensagem("Este navegador não oferece leitura em voz alta.", true);
        return;
    }
    pararLeitura();
    const fala = new SpeechSynthesisUtterance(texto);
    fala.lang = "pt-BR";
    fala.rate = 0.95;
    fala.volume = 1;
    const vozes = window.speechSynthesis.getVoices();
    const voz = vozes.find((item) => item.lang.toLowerCase().replace("_", "-") === "pt-br")
        ?? vozes.find((item) => item.lang.toLowerCase().startsWith("pt"));
    if (voz) fala.voice = voz;

    // Mantém a fala referenciada até o término e permite interromper no mesmo botão.
    falaAtual = fala;
    botaoEmLeitura = botao;
    botao.querySelector("span").textContent = "Parar";
    botao.setAttribute("aria-pressed", "true");
    botao.setAttribute("aria-label", "Parar leitura em voz alta");
    fala.onend = () => { if (falaAtual === fala) pararLeitura(); };
    fala.onerror = (evento) => {
        if (falaAtual !== fala) return;
        pararLeitura();
        if (!["canceled", "interrupted"].includes(evento.error)) {
            exibirMensagem("Não foi possível reproduzir o áudio. Tente novamente ou use outro navegador.", true);
        }
    };
    try {
        window.speechSynthesis.resume();
        window.speechSynthesis.speak(fala);
    } catch {
        pararLeitura();
        exibirMensagem("Não foi possível iniciar a leitura. Tente novamente.", true);
    }
}

function definirCarregamento(ativo, mensagem = "") {
    carregando = ativo;
    botaoBuscar.disabled = ativo;
    botoesFiltro.forEach((botao) => { botao.disabled = ativo; });
    textoBuscar.textContent = ativo ? "Buscando unidades…" : "Encontrar unidades próximas";
    loading.hidden = !ativo;
    loadingTexto.textContent = mensagem;
    resultadoContainer.setAttribute("aria-busy", String(ativo));
}

function exibirMensagem(texto, erro = false, aviso = false) {
    mensagemStatus.textContent = texto;
    mensagemStatus.classList.toggle("erro", erro);
    mensagemStatus.classList.toggle("aviso", aviso);
}

function mostrarEstado(titulo, descricao) {
    estadoVazio.hidden = false;
    estadoTitulo.textContent = titulo;
    estadoDescricao.textContent = descricao;
}

function aguardarRenderizacao() {
    return new Promise((resolve) => {
        // Também libera os controles se a aba estiver em segundo plano, sem frames.
        const limite = setTimeout(resolve, 200);
        requestAnimationFrame(() => requestAnimationFrame(() => {
            clearTimeout(limite);
            resolve();
        }));
    });
}
