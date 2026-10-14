const API_URL = "http://localhost:8080/api/recomendacoes";

export class ApiClient {
    async buscarRecomendacoes(lat, lng, servico = "") {
        const url = new URL(API_URL);
        url.searchParams.set("lat", lat);
        url.searchParams.set("lng", lng);

        if (servico) {
            url.searchParams.set("servico", servico);
        }

        try {
            const resposta = await fetch(url);

            if (!resposta.ok) {
                throw new Error(`A API respondeu com o status ${resposta.status}.`);
            }

            return await resposta.json();
        } catch (erro) {
            if (erro instanceof TypeError) {
                throw new Error(
                    "Não foi possível acessar o servidor. Verifique se a API está ativa e se o CORS está configurado.",
                    { cause: erro }
                );
            }

            throw erro;
        }
    }
}
