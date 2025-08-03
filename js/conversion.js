import { limitDecimals } from './format.js';

/**
 * Mapeamento dos períodos para número de dias.
 */
export const periodInDays = {
  day: 1,
  week: 7,
  month: 30,
  bimester: 60,
  quarter: 90,
  semester: 180,
  year: 360,
};

/**
 * Converte taxa de juros entre dois períodos diferentes.
 * @param {number} rate Taxa original em decimal (ex: 0.05 para 5%)
 * @param {string} from Período de origem (ex: 'month')
 * @param {string} to Período de destino (ex: 'year')
 * @returns {number} Taxa convertida, arredondada a 6 casas decimais
 */
export function convertInterestRate(rate, from, to) {
  const exponent = periodInDays[to] / periodInDays[from];
  const converted = Math.pow(1 + rate, exponent) - 1;
  return limitDecimals(converted, 6);
}

/**
 * Dada uma taxa em decimal e seu período base, converte para todas as outras linhas da tabela.
 * @param {number} rate Taxa em decimal (ex: 0.05)
 * @param {string} columnPeriod Período base (ex: 'month')
 * @returns {object} Objeto com taxas convertidas para cada período
 */
export function convertColumnFromPeriod(rate, columnPeriod) {
  const result = {};

  Object.keys(periodInDays).forEach(rowPeriod => {
    result[rowPeriod] = convertInterestRate(rate, columnPeriod, rowPeriod);
  });

  return result;
}