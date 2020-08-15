import createServer from './createServer';

export default {
  login: createServer('POST', '/accountbook/rest/user/v1/login', false),
  bindPhone: createServer('POST', '/accountbook/rest/user/v1/bind/phone'),
};
