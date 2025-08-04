export function limitDecimals(valor, casas = 2) {
	const fator = Math.pow(10, casas);
	return Math.round(valor * fator) / fator;
}

export function convertPercentage(value) {
  if (!value) return 0;
  const sanitized = value.replace(',', '.');
  return Number(sanitized) / 100;
}

export function formatPercentage(value) {
  if (value == null || isNaN(value)) value = 0;

  const percentage = value * 100; // converte para % real pra exibir

  // Se for menor que 0.01% (0.0001 decimal), mostra 4 casas, senão 2
  const digits = Math.abs(percentage) < 0.01 && percentage !== 0 ? 4 : 2;

  return percentage.toLocaleString('pt-BR', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }) + '%';
}

export function formatCurrency(value) {
	if (value == null || isNaN(value)) value = 0;
	return value.toLocaleString('pt-BR', {
		style: 'currency',
		currency: 'BRL'
	});
}

export function formatDate(date) {
	const d = typeof date === 'string' ? new Date(date) : date;
	const day = d.getDate().toString().padStart(2, '0');
	const month = (d.getMonth() + 1).toString().padStart(2, '0');
	const year = d.getFullYear();
	return `${day}/${month}/${year}`;
}

export function parseCurrency(value) {
	if (!value) return 0;
	const cleaned = value.replace(/[^\d,]/g, '').replace(/\./g, '').replace(',', '.');
	const parsed = parseFloat(cleaned);
	return isNaN(parsed) ? 0 : parsed;
}

export function generateId() {
	return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}