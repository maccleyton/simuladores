import { economicRates, iofTracks, irrfTracks } from './taxTables.js';

const taxaMap = {
  cdi:        { base: 'cdi', tipo: 'Taxa Posfixada', flexDefault: 100 },
  cdiplus:    { base: 'cdi', tipo: 'Taxa Hibrida',    flexDefault: 0 },
  selic:      { base: 'selic', tipo: 'Taxa Posfixada', flexDefault: 100 },
  selicplus:  { base: 'selic', tipo: 'Taxa Hibrida',    flexDefault: 0 },
  ipca:       { base: 'ipca', tipo: 'Taxa Posfixada', flexDefault: 100 },
  ipcaplus:   { base: 'ipca', tipo: 'Taxa Hibrida',    flexDefault: 0 },
  prefixed:   { base: null, tipo: 'Taxa Prefixada', flexDefault: 0 }
};

const selectRate = document.getElementById('selectRate');
const rateTypeCell = document.getElementById('rateType');
const rateCell = document.getElementById('rate');
const rateFlexInput = document.getElementById('rateFlex');
const finalRateCell = document.getElementById('finalRate');
const capitalInput = document.querySelector('input[placeholder="digite o capital"]');
const vencimentoInput = document.querySelector('input[type="date"]');
const termCell = document.getElementById('term');
const grossValueCell = document.getElementById('grossValue');
const yieldValueCell = document.getElementById('yieldValue');
const iofCell = document.getElementById('iofValue');
const irrfCell = document.getElementById('irrfValue');
const irrfTaxRateCell = document.getElementById('irrfTaxRate');
const discountsCell = document.getElementById('discountsValue');
const netValueCell = document.getElementById('netValue');

function formatPtBrPercent(value) {
  return value.toFixed(2).replace('.', ',') + '%';
}

function converterTaxaEquivalente(anual) {
  const mensal = Math.pow(1 + anual, 1 / 12) - 1;
  const diaria = Math.pow(1 + anual, 1 / 252) - 1;
  return { mensal, diaria };
}

function atualizarTaxa() {
  const selected = selectRate.value;
  if (!selected) {
    rateTypeCell.textContent = '';
    rateCell.textContent = '';
    rateFlexInput.value = '';
    finalRateCell.textContent = '';
    return;
  }

  const tipoInfo = taxaMap[selected];
  rateTypeCell.textContent = tipoInfo.tipo;

  const baseRate = tipoInfo.base ? economicRates[tipoInfo.base] : null;
  rateCell.textContent = baseRate !== null ? formatPtBrPercent(baseRate * 100) : 'Informe a taxa =>';

  rateFlexInput.value = formatPtBrPercent(tipoInfo.flexDefault);
  rateFlexInput.disabled = false;

  calcularTaxaReal();
}

function calcularTaxaReal() {
  const selected = selectRate.value;
  const tipoInfo = taxaMap[selected];
  if (!tipoInfo) return;

  const baseRate = tipoInfo.base ? economicRates[tipoInfo.base] : 0;

  let flexStr = rateFlexInput.value.trim().replace('%', '').replace(',', '.');
  let flexNum = flexStr === '' ? 0 : parseFloat(flexStr);
  if (isNaN(flexNum)) flexNum = 0;
  flexNum = flexNum / 100;

  let finalRate = 0;
  if (tipoInfo.tipo === 'Taxa Posfixada') {
    finalRate = baseRate * flexNum;
  } else if (tipoInfo.tipo === 'Taxa Hibrida') {
    finalRate = baseRate + flexNum;
  } else {
    finalRate = flexNum;
  }

  finalRateCell.textContent = formatPtBrPercent(finalRate * 100);

  const rateConv = converterTaxaEquivalente(baseRate);
  const flexConv = converterTaxaEquivalente(flexNum);
  const finalConv = converterTaxaEquivalente(finalRate);

  document.getElementById('monthlyFeeA').textContent = formatPtBrPercent(rateConv.mensal * 100);
  document.getElementById('dailyFeeA').textContent = formatPtBrPercent(rateConv.diaria * 100);

  if (tipoInfo.tipo === 'Taxa Posfixada') {
    document.getElementById('monthlyFeeB').textContent = formatPtBrPercent(flexNum * 100);
    document.getElementById('dailyFeeB').textContent = formatPtBrPercent(flexNum * 100);
  } else {
    document.getElementById('monthlyFeeB').textContent = formatPtBrPercent(flexConv.mensal * 100);
    document.getElementById('dailyFeeB').textContent = formatPtBrPercent(flexConv.diaria * 100);
  }

  document.getElementById('monthlyFeeC').textContent = formatPtBrPercent(finalConv.mensal * 100);
  document.getElementById('dailyFeeC').textContent = formatPtBrPercent(finalConv.diaria * 100);
}

function calcularPrazoERendimento() {
  const capital = parseFloat(capitalInput.value.replace(',', '.'));
  const hoje = new Date();
  const vencimento = new Date(vencimentoInput.value);

  if (isNaN(capital) || !vencimentoInput.value) {
    [termCell, grossValueCell, yieldValueCell, iofCell, irrfCell, irrfTaxRateCell, discountsCell, netValueCell]
      .forEach(cell => cell.textContent = '');
    return;
  }

  const dias = Math.ceil((vencimento - hoje) / (1000 * 60 * 60 * 24));
  if (dias <= 0) {
    termCell.textContent = 'Vencido';
    [grossValueCell, yieldValueCell, iofCell, irrfCell, discountsCell, netValueCell].forEach(cell => cell.textContent = '0,00');
    irrfTaxRateCell.textContent = '0,00%';
    return;
  }

  termCell.textContent = dias + ' dias';

  const taxaStr = finalRateCell.textContent.replace('%', '').replace(',', '.');
  const taxaAnual = parseFloat(taxaStr) / 100;
  if (isNaN(taxaAnual)) return;

  const taxaDiaria = Math.pow(1 + taxaAnual, 1 / 252) - 1;
  const montante = capital * Math.pow(1 + taxaDiaria, dias);
  const rendimento = montante - capital;

  grossValueCell.textContent = montante.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
  yieldValueCell.textContent = rendimento.toLocaleString('pt-BR', { minimumFractionDigits: 2 });

  let aliquotaIof = 0;
  if (dias < 30) {
    const faixaIof = iofTracks.find(f => dias <= f.days);
    aliquotaIof = faixaIof ? faixaIof.aliquot : 0;
  }
  const valorIof = rendimento * aliquotaIof;
  iofCell.textContent = valorIof.toLocaleString('pt-BR', { minimumFractionDigits: 2 });

  let aliquotaIrrf = 0;
  for (const faixa of irrfTracks) {
    if (dias <= faixa.days) {
      aliquotaIrrf = faixa.aliquot;
      break;
    }
  }
  const valorIrrf = (rendimento - valorIof) * aliquotaIrrf;

  irrfCell.textContent = valorIrrf.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
  irrfTaxRateCell.textContent = (aliquotaIrrf * 100).toFixed(2) + '%';

  const totalDescontos = valorIof + valorIrrf;
  const valorLiquido = montante - totalDescontos;

  discountsCell.textContent = totalDescontos.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
  netValueCell.textContent = valorLiquido.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
}

// Eventos
selectRate.addEventListener('change', () => {
  atualizarTaxa();
  calcularPrazoERendimento();
});

rateFlexInput.addEventListener('input', () => {
  calcularTaxaReal();
  calcularPrazoERendimento();
});

capitalInput.addEventListener('input', calcularPrazoERendimento);
vencimentoInput.addEventListener('change', calcularPrazoERendimento);
window.addEventListener('load', calcularPrazoERendimento);