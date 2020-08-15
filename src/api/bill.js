import createServer from './createServer';

export default {
	add: createServer('POST', '/accountbook/rest/bill/v1'),
	amount: createServer('GET', '/accountbook/rest/bill/v1/amount'),
	list: createServer('POST', '/accountbook/rest/bill/v1/list'),
	debtorAccrual: createServer('GET', '/accountbook/rest/bill/v1/debtor/accrual/list'),
	debtorAmount: createServer('GET', '/accountbook/rest/bill/v1/amount/debtorId/{debtorId}'),
	debtorMonthList: createServer('GET', '/accountbook/rest/bill/v1/debtor/month/list'),
	debtorList: createServer('POST', '/accountbook/rest/bill/v1/debtor/list'),
	addPackage: createServer('POST', '/accountbook/rest/bill/v1/accrual'),
};
