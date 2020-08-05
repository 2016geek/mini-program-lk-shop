import createServer from './createServer'

export default {
	list: createServer('GET', '/accountbook/rest/debtor/v1/list'),
	add: createServer('POST', '/accountbook/rest/debtor/v1'),
}
