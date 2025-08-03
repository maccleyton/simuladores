export function limitDecimals(valor, casas = 2) {
	const fator = Math.pow(10, casas);
	return Math.round(valor * fator) / fator;
}

export function convertPercentage(value) {
	return Number(value) / 100;
}

export function formatPercentage(value) {
	if (value == null || isNaN(value)) value = 0;
	return value.toLocaleString('pt-BR', {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
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
	const cleaned = value.replace(/\./g, '').replace(',', '.');
	const parsed = parseFloat(cleaned);
	return isNaN(parsed) ? 0 : parsed;
}

export function generateId() {
	return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}