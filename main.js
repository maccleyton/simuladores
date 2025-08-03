import { getEconomicIndicators } from './js/indicadores.js';
import { convertPercentage, formatPercentage } from './js/format.js';
import { convertColumnFromPeriod } from './js/conversion.js';

const selectRate = document.getElementById('selectRate');
const rateCell = document.getElementById('rate');
const rateFlexInput = document.getElementById('rateFlex');
const rateTypeCell = document.getElementById('rateType');
const finalRateCell = document.getElementById('finalRate');

const monthlyFeeA = document.getElementById('monthlyFeeA');
const monthlyFeeB = document.getElementById('monthlyFeeB');
const monthlyFeeC = document.getElementById('monthlyFeeC');
const dailyFeeA = document.getElementById('dailyFeeA');
const dailyFeeB = document.getElementById('dailyFeeB');
const dailyFeeC = document.getElementById('dailyFeeC');

let economicData = null;

async function carregarTaxas() {
  economicData = await getEconomicIndicators();
  console.log('Taxas carregadas:', economicData);
}

function getRateBase(tipo) {
  switch (tipo) {
    case 'cdi': return economicData?.cdi ?? 0;
    case 'selic': return economicData?.selic ?? 0;
    case 'ipca': return economicData?.ipca ?? 0;
    case 'cdiplus': return economicData?.cdi ?? 0;
    case 'selicplus': return economicData?.selic ?? 0;
    case 'ipcaplus': return economicData?.ipca ?? 0;
    default: return 0;
  }
}

function atualizarRateType(tipo) {
  if (tipo === 'cdi' || tipo === 'selic' || tipo === 'ipca') {
    rateTypeCell.textContent = 'Taxa Pósfixada';
    rateFlexInput.value = '100,00';
    rateFlexInput.disabled = false;
  } else if (tipo === 'cdiplus' || tipo === 'selicplus' || tipo === 'ipcaplus') {
    rateTypeCell.textContent = 'Taxa Híbrida';
    rateFlexInput.value = '';
    rateFlexInput.disabled = false;
  } else if (tipo === 'prefixed') {
    rateTypeCell.textContent = 'Taxa Prefixada';
    rateFlexInput.value = '';
    rateFlexInput.disabled = false;
  } else {
    rateTypeCell.textContent = '';
    rateFlexInput.value = '';
    rateFlexInput.disabled = true;
  }
}

function calcularFinalRate(tipo) {
  const baseRate = convertPercentage(getRateBase(tipo));
  const flexRate = convertPercentage(rateFlexInput.value || '0');

  let finalRate = 0;
  if (tipo === 'cdi' || tipo === 'selic' || tipo === 'ipca') {
    finalRate = baseRate * flexRate;
  } else if (tipo === 'cdiplus' || tipo === 'selicplus' || tipo === 'ipcaplus') {
    finalRate = baseRate + flexRate;
  } else if (tipo === 'prefixed') {
    finalRate = flexRate;
  }

  finalRateCell.textContent = formatPercentage(finalRate);
  atualizarConversoes(finalRate, baseRate, flexRate, tipo);
}

function atualizarConversoes(finalRate, baseRate, flexRate, tipo) {
  const baseConverted = convertColumnFromPeriod(baseRate, 'year');
  const flexConverted = convertColumnFromPeriod(flexRate, 'year');
  const finalConverted = convertColumnFromPeriod(finalRate, 'year');

  monthlyFeeA.textContent = formatPercentage(baseConverted.month);
  monthlyFeeB.textContent = formatPercentage(flexConverted.month);
  monthlyFeeC.textContent = formatPercentage(finalConverted.month);

  dailyFeeA.textContent = formatPercentage(baseConverted.day);
  dailyFeeB.textContent = formatPercentage(flexConverted.day);
  dailyFeeC.textContent = formatPercentage(finalConverted.day);
}

selectRate.addEventListener('change', async () => {
  const tipo = selectRate.value;
  await carregarTaxas();

  if (tipo === 'prefixed') {
    rateCell.textContent = 'Informe a taxa =>';
  } else {
    const baseRate = getRateBase(tipo);
    rateCell.textContent = formatPercentage(baseRate);
  }

  atualizarRateType(tipo);
  calcularFinalRate(tipo);
});

rateFlexInput.addEventListener('input', () => {
  const tipo = selectRate.value;
  calcularFinalRate(tipo);
});

// Carrega dados ao iniciar a página
window.addEventListener('load', carregarTaxas);
