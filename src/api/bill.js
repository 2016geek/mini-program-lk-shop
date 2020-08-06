import createServer from './createServer'

export default {
	add: createServer('POST', '/accountbook/rest/bill/v1'),
}
