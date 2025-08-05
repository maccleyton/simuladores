/**
 * Tabela regressiva do IRRF (Imposto de Renda Retido na Fonte)
 * para aplicações financeiras, conforme dias mantidos.
 */
export const irrfTracks = [
  { days: 180, aliquot: 0.225 },
  { days: 360, aliquot: 0.200 },
  { days: 720, aliquot: 0.175 },
  { days: Infinity, aliquot: 0.150 }
];

/**
 * Retorna a alíquota do IRRF com base no prazo de aplicação.
 * @param daysHeld Quantidade de dias da aplicação
 * @returns Alíquota correspondente
 */
export function getIRRFAliquot(daysHeld) {
  for (const faixa of irrfTracks) {
    if (daysHeld <= faixa.days) return faixa.aliquot;
  }
  return 0; // Fallback (não deve acontecer)
}

/**
 * Tabela regressiva do IOF (Imposto sobre Operações Financeiras)
 * aplicada em resgates com menos de 30 dias.
 */
export const iofTracks = [
  { days: 1, aliquot: 0.96 },
  { days: 2, aliquot: 0.93 },
  { days: 3, aliquot: 0.90 },
  { days: 4, aliquot: 0.86 },
  { days: 5, aliquot: 0.83 },
  { days: 6, aliquot: 0.80 },
  { days: 7, aliquot: 0.76 },
  { days: 8, aliquot: 0.73 },
  { days: 9, aliquot: 0.70 },
  { days: 10, aliquot: 0.66 },
  { days: 11, aliquot: 0.63 },
  { days: 12, aliquot: 0.60 },
  { days: 13, aliquot: 0.56 },
  { days: 14, aliquot: 0.53 },
  { days: 15, aliquot: 0.50 },
  { days: 16, aliquot: 0.46 },
  { days: 17, aliquot: 0.43 },
  { days: 18, aliquot: 0.40 },
  { days: 19, aliquot: 0.36 },
  { days: 20, aliquot: 0.33 },
  { days: 21, aliquot: 0.30 },
  { days: 22, aliquot: 0.26 },
  { days: 23, aliquot: 0.23 },
  { days: 24, aliquot: 0.20 },
  { days: 25, aliquot: 0.16 },
  { days: 26, aliquot: 0.13 },
  { days: 27, aliquot: 0.10 },
  { days: 28, aliquot: 0.06 },
  { days: 29, aliquot: 0.03 },
  { days: 30, aliquot: 0.00 }
];

/**
 * Retorna a alíquota do IOF com base na quantidade de dias da aplicação.
 * Só aplica para aplicações com resgate < 30 dias.
 * @param daysHeld Dias mantidos
 * @returns Alíquota correspondente ou 0 se não houver IOF
 */
export function getIOFAliquot(daysHeld) {
  const faixa = iofTracks.find(f => f.days === daysHeld);
  return faixa ? faixa.aliquot : 0;
}

/**
 * Tabela contendo os principais índices econômicos utilizados
 * aplicada em cálculos financeiros, como CDI, Selic e IPCA.
 * Os valores estão expressos em taxa anual.
 */
export const economicRates = {
  cdi: 0.1490,     // 14,90% ao ano
  selic: 0.1500,   // 15,00% ao ano
  ipca: 0.0535     // 5,35% ao ano
};