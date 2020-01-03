import { SessionCollection_DEPRECATED } from "../base/db/mongodb";

/**
 * Functions for external storage
 * https://github.com/koajs/session#external-session-stores
 */
export async function get(key, maxAge, { rolling }) {
  const $sessions = await SessionCollection_DEPRECATED();
  const session = await $sessions.findOne({ _id: key });

  return session ? session.payload : {};
}

export async function set(key: string, payload, maxAge, { rolling, changed }) {
  const $sessions = await SessionCollection_DEPRECATED();
  const filter = { _id: key };
  const update = {
    $set: {
      _id: key,
      payload: payload,
      updatedAt: new Date()
    }
  }
  const options = {
    upsert: true
  }
  
  await $sessions.findOneAndUpdate(filter, update, options);
}

export async function destroy(key) {
  const $sessions = await SessionCollection_DEPRECATED();

  await $sessions.deleteOne({
    _id: key
  })
}

/**
 * https://github.com/koajs/session#example
 */
export const config = {
  key: 'sid', /** (string) cookie key (default is koa:sess) */
  /** (number || 'session') maxAge in ms (default is 1 days) */
  /** 'session' will result in a cookie that expires when session/browser is closed */
  /** Warning: If a session cookie is stolen, this cookie will never expire */
  maxAge: 60 * 60 * 24 * 365 * 2 * 1000, // 2 years,
  autoCommit: true, /** (boolean) automatically commit headers (default true) */
  overwrite: true, /** (boolean) can overwrite or not (default true) */
  httpOnly: false, /** (boolean) httpOnly or not (default true) */
  signed: false, /** (boolean) signed or not (default true) */
  rolling: true, /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
  renew: true, /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/
  store: {
    get,
    set,
    destroy
  }
};
