import { formatCurrency, parseCurrency } from './format.js';

// Elementos de entrada
const nominalInput = document.getElementById('nominalValue');
const maturityInput = document.getElementById('maturity');
const discountRateInput = document.getElementById('discountRate');
const tariffsInput = document.getElementById('tariffs');

// Elementos de saída
const mediumTermCell = document.getElementById('mediumTerm');
const interestCell = document.getElementById('interest');
const fixedIOFCell = document.getElementById('fixedIOF');
const additionalIOFCell = document.getElementById('additionalIOF');
const discountedAmountCell = document.getElementById('discountedAmount');

/**
 * Calcula o prazo entre hoje e a data de vencimento em dias corridos.
 */
function calcularPrazoEmDias(dataVencimento) {
	const hoje = new Date();
	const vencimento = new Date(dataVencimento);
	const diff = vencimento.getTime() - hoje.setHours(0, 0, 0, 0);
	return diff > 0 ? Math.ceil(diff / (1000 * 60 * 60 * 24)) : 0;
}

/**
 * Retorna o IOF fixo e adicional com base no valor descontado e prazo.
 */
function calcularIOF(valorDescontado, prazoDias) {
	const iofFixo = valorDescontado * 0.0038;
	const iofAdicional = valorDescontado * 0.000082 * prazoDias;
	return { iofFixo, iofAdicional };
}

/**
 * Função principal de cálculo do desconto comercial.
 */
function calcularDescontoComercial() {
	const valorNominal = parseCurrency(nominalInput.value);
	const vencimento = maturityInput.value;
	const taxaMes = parseFloat(discountRateInput.value) / 100 || 0;
	const tarifas = parseFloat(tariffsInput.value) || 0;

	if (!valorNominal || !vencimento || !taxaMes) {
		// Limpa se faltar info
		[mediumTermCell, interestCell, fixedIOFCell, additionalIOFCell, discountedAmountCell]
			.forEach(el => el.textContent = '');
		return;
	}

	const prazoDias = calcularPrazoEmDias(vencimento);
	const prazoMeses = prazoDias / 30;

	// Juros = valor nominal * taxa mensal * prazo (simples)
	const juros = valorNominal * taxaMes * prazoMeses;

	// Valor descontado = valor nominal - juros - tarifas
	const valorDescontado = valorNominal - juros - tarifas;

	// IOFs
	const { iofFixo, iofAdicional } = calcularIOF(valorDescontado, prazoDias);

	// Valor líquido
	const valorLiquido = valorDescontado - iofFixo - iofAdicional;

	// Exibir no DOM
	mediumTermCell.textContent = `${prazoDias} dias`;
	interestCell.textContent = formatCurrency(juros);
	fixedIOFCell.textContent = formatCurrency(iofFixo);
	additionalIOFCell.textContent = formatCurrency(iofAdicional);
	discountedAmountCell.textContent = formatCurrency(valorLiquido);
}

/**
 * Formata campo de moeda conforme digitação (pt-BR).
 */
// Deixa digitar livremente números e vírgula
// Permite digitar livremente números e vírgula
// Formata valor nominal enquanto digita (pt-BR)
// Digitação livre (chama o cálculo ao digitar)
nominalInput.addEventListener('input', () => {
	calcularDescontoComercial();
});

// Formata como moeda quando sai do campo
nominalInput.addEventListener('blur', () => {
	const valor = parseCurrency(nominalInput.value);
	nominalInput.value = formatCurrency(valor);
});

// Remove formatação ao focar no campo
nominalInput.addEventListener('focus', () => {
	const valor = parseCurrency(nominalInput.value);
	nominalInput.value = valor ? valor.toFixed(2).replace('.', ',') : '';
});


[nominalInput, maturityInput, discountRateInput, tariffsInput].forEach(input =>
  input.addEventListener('input', calcularDescontoComercial)
);
