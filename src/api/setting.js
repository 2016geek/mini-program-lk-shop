import createServer from './createServer';

export default {
  getEmail: createServer('GET', '/accountbook/rest/mail/v1'),
  setEmail: createServer('POST', '/accountbook/rest/mail/v1'),
};
