import createServer from './createServer';

export default {
	login: createServer('POST', '/user/v1/login', false),
	getOrderList: createServer('get', '/user/order/list', true),
	getOrderDetail: (id) => createServer('get', `/user/order/detail/${id}`, true),
	getTraceList: (id) => createServer('get', `/user/order/trace/${id}`, true),
	getAddressList: createServer('get', '/user/address/list', true),
	addAddress: createServer('post', '/user/address/add', true),
	exportForm: createServer('get', '/user/order/detail/export/{id}', true),
	submitForm: createServer('post', '/user/order/last', true),
	getUserInfo: createServer('get', '/user/info', true),
};
