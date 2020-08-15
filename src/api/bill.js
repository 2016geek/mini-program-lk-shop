import createServer from './createServer'

export default {
	add: createServer('POST', '/accountbook/rest/bill/v1'),
	getDetail: createServer('GET', '/accountbook/rest/bill/v1/id/{id}'),
	del: createServer('DELETE', '/accountbook/rest/bill/v1/id/{id}'),
	update: createServer('PUT', '/accountbook/rest/bill/v1/id/{id}'),
}
