import createServer from './createServer';

export default {
	login: createServer('POST', '/printing/user/v1/login', false),
	bindPhone: createServer('POST', '/accountbook/rest/user/v1/bind/phone'),
	getOrderList: createServer('get', '/printing/user/order/list', true),
	getOrderDetail: (id) => createServer('get', `/printing/user/order/detail/${id}`, true),
	getTraceList: (id) => createServer('get', `/printing/user/order/trace/${id}`, true),
	getAddressList: createServer('get', '/printing/user/address/list', true),
	addAddress: createServer('post', '/printing/user/address/add', true),
	exportForm: createServer('get', '/printing/user/order/detail/export/{id}', true),
	submitForm: createServer('post', '/printing/user/order/last', true),
	getUserInfo: createServer('get', '/printing/user/info', true),
};
