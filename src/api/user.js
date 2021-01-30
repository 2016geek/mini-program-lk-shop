import createServer from './createServer';

export default {
	login: createServer('POST', '/printing/user/v1/login', false),
	bindPhone: createServer('POST', '/accountbook/rest/user/v1/bind/phone'),
	getOrderList: createServer('get', '/printing/user/order/list', false),
	getOrderDetail: (id) => createServer('get', `/printing/user/order/detail/${id}`, false),
	getTraceList: (id) => createServer('get', `/printing/user/order/trace/${id}`, false),
	getAddressList: createServer('get', '/printing/user/address/list', false),
	addAddress: createServer('post', '/printing/user/address/add', false),
	exportForm: createServer('get', '/printing/user/order/detail/export/{id}', false),
	submitForm: createServer('post', '/printing/user/order/last', false)
};
