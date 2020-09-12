import createServer from './createServer';

export default {
  getEmail: createServer('GET', '/accountbook/rest/mail/v1'),
  setEmail: createServer('POST', '/accountbook/rest/mail/v1'),
  setSetting: createServer('POST', '/accountbook/rest/setting/v1'),
  getSetting: createServer('GET', '/accountbook/rest/setting/v1'),
};
