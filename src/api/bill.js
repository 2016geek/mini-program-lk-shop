import createServer from './createServer';

export default {
	add: createServer('POST', '/accountbook/rest/bill/v1'),
	getDetail: createServer('GET', '/accountbook/rest/bill/v1/id/{id}'),
	del: createServer('DELETE', '/accountbook/rest/bill/v1/id/{id}'),
	update: createServer('PUT', '/accountbook/rest/bill/v1/id/{id}'),
	amount: createServer('GET', '/accountbook/rest/bill/v1/amount'),
	list: createServer('GET', '/accountbook/rest/bill/v1/list'),
	debtorAccrual: createServer(
		'GET',
		'/accountbook/rest/bill/v1/debtor/accrual/list',
	),
	debtorAmount: createServer(
		'GET',
		'/accountbook/rest/bill/v1/amount/debtorId/2',
	),
	debtorMonthList: createServer(
		'GET',
		'/accountbook/rest/bill/v1/debtor/month/list',
	),
	debtorList: createServer('POST', '/accountbook/rest/bill/v1/debtor/list'),
};
