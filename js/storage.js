// Armazenamento local
export const financialStorage = {
	mediumTerm: null,
	interest: null,
	fixedIOF: null,
	additionalIOF: null,
	discountedAmount: null,
	day: null,
	week: null,
	month: null,
	bimester: null,
	quarter: null,
	semester: null,
	year: null,
	nominalValue: null,
	discountRate: null,
	maturity: null,
	tariffs: null,
	toDay: null,
	toWeek: null,
	toMonth: null,
	toBimester: null,
	toQuarter: null,
	toSemester: null,
	toYear: null
};

export const investmentStorage = {
	rate: null,
	cdi: null,
	selic: null,
	ipca: null,
	cdiplus: null,
	selicplus: null,
	ipcaplus: null,
	prefixado: null,
	rateType: null,
	finalRate: null,
	monthlyFeeA: null,
	monthlyFeeB: null,
	monthlyFeeC: null,
	dailyFeeA: null,
	dailyFeeB: null,
	dailyFeeC: null,
	investimentValue: null,
	grossValue: null,
	yieldValue: null,
	term: null,
	iofValue: null,
	irrfValue: null,
	irrfTaxRate: null,
	discountsValue: null,
	netValue: null
};

// Funções pra pegar os inputs (DOM)
export function getInputs() {
	return {
		nominalValueInput: document.getElementById('nominalValue'),
		maturityInput: document.getElementById('maturity'),
		discountRateInput: document.getElementById('discountRate'),
		tariffsInput: document.getElementById('tariffs')
	};
}

// Funções pra pegar os outputs (DOM)
export function getOutputs() {
	return {
		mediumTermCell: document.getElementById('mediumTerm'),
		interestCell: document.getElementById('interest'),
		fixedIOFCell: document.getElementById('fixedIOF'),
		additionalIOFCell: document.getElementById('additionalIOF'),
		discountedAmountCell: document.getElementById('discountedAmount')
	};
}
