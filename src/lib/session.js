const session = require('koa-session');
const redis = require('./redis');

const sessions = {};

store = {
  async get(key) {
    const value = await redis.instance().get(key);

    try {
      return JSON.parse(value);
    }
    catch(e) {
      return {};
    }
  },

  async set(key, value) {
    value = JSON.stringify(value);

    await redis.instance().set(key, value);
  },

  async destroy(key) {
    await redis.instance().destroy(key)
  },
};

const config = {
  key: '_s', // key for Cookie
  renew: true,
  store: store,
};

module.exports = function(app) {
  return session(config, app);
};
