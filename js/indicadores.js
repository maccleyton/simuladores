// Função para buscar dados da API do Banco Central
async function fetchBcbData(codigoSerie) {
    const url = `https://api.bcb.gov.br/dados/serie/bcdata.sgs.${codigoSerie}/dados/ultimos/1?formato=json`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        return Number(data[0].valor); // já é número, só garantir
    } catch (error) {
        console.error("Erro ao buscar dados:", error);
        return null;
    }
}

// Códigos das séries no BCB
const codigos = {
    selic: 11,
    ipca: 433,
    cdi: 12
};

// Função pública que retorna todas as taxas
export async function getEconomicIndicators() {
    const [selic, ipca, cdi] = await Promise.all([
        fetchBcbData(codigos.selic),
        fetchBcbData(codigos.ipca),
        fetchBcbData(codigos.cdi)
    ]);

    return { selic, ipca, cdi };
}
