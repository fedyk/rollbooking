import * as koaSession from 'koa-session'
import { instance } from './redis'

const store = {
  async get(key) {
    const value = await instance().get(key);

    try {
      return JSON.parse(value);
    }
    catch (e) {
      return {};
    }
  },

  async set(key, value) {
    value = JSON.stringify(value);

    await instance().set(key, value);
  },

  async destroy(key) {
    await instance().del(key)
  },
};

const config = {
  key: '_s', // key for Cookie
  renew: true,
  store: store,
};

export function session(app) {
  return koaSession(config, app);
};
