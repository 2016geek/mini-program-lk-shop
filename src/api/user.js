import createServer from './createServer';

export default {
  login: createServer('POST', '/accountbook/rest/user/v1/login', false),
  bindPhone: createServer('POST', '/accountbook/rest/user/v1/bind/phone'),
	getOrderList: createServer('get', '/printing/user/order/list', false),
	getOrderDetail: (id) => createServer('get', `/printing/user/order/detail/${id}`, false),
	getTraceList: (id) => createServer('get', `/printing/user/order/trace/${id}`, false),
};
