import { convertColumnFromPeriod } from './conversion.js'; // sua lógica de conversão
import { formatPercentage, convertPercentage } from './format.js';

const selectPeriod = document.getElementById('selectPeriod');
const taxInput = document.getElementById('taxInput');

const ids = ['toDay', 'toWeek', 'toMonth', 'toBimester', 'toQuarter', 'toSemester', 'toYear'];

function atualizarConversao() {
  const periodBase = selectPeriod.value;
  const taxaRaw = taxInput.value || '0';
  const taxaDecimal = convertPercentage(taxaRaw);
  const taxasConvertidas = convertColumnFromPeriod(taxaDecimal, periodBase);

  ids.forEach(id => {
    const cell = document.getElementById(id);
    if (!cell) return;
    const periodo = id.replace('to', '').toLowerCase();

    const isMesmoPeriodo = periodo === periodBase.toLowerCase();
    const val = isMesmoPeriodo ? taxaDecimal : (taxasConvertidas[periodo] || 0);

    cell.textContent = formatPercentage(val, 4);
  });
}


selectPeriod.addEventListener('change', atualizarConversao);
taxInput.addEventListener('input', (e) => {
  let val = taxInput.value;

  // Remove tudo que não for número ou vírgula
  val = val.replace(/[^\d,]/g, '');

  // Garante só uma vírgula
  const partes = val.split(',');
  if (partes.length > 2) {
    val = partes[0] + ',' + partes[1];
  }

  // Limita a 4 casas decimais
  if (partes[1]?.length > 4) {
    partes[1] = partes[1].slice(0, 4);
  }

  taxInput.value = partes.join(',');
  atualizarConversao();
});


// Inicializa a tabela com os valores padrões
document.addEventListener('DOMContentLoaded', () => {
  atualizarConversao();
});
