// import * as Session from "koa-session"
// import { instance } from "./redis"

/**
 * https://github.com/koajs/session#external-session-stores
 */

// const store = {
//   async get(key) {
//     const value = await instance().get(key);

//     try {
//       return JSON.parse(value);
//     }
//     catch (e) {
//       return {};
//     }
//   },

//   async set(key, value) {
//     value = JSON.stringify(value);

//     await instance().set(key, value);
//   },

//   async destroy(key) {
//     await instance().del(key)
//   },
// };

// const config = {
//   key: "_s", // key for Cookie
//   renew: true,
//   store: store,
// };

// export function session(app) {
//   return Session(config, app);
// };


/**
 * https://github.com/koajs/session#example
 */
export const config = {
  key: 's', /** (string) cookie key (default is koa:sess) */
  /** (number || 'session') maxAge in ms (default is 1 days) */
  /** 'session' will result in a cookie that expires when session/browser is closed */
  /** Warning: If a session cookie is stolen, this cookie will never expire */
  maxAge: 86400000,
  autoCommit: true, /** (boolean) automatically commit headers (default true) */
  overwrite: true, /** (boolean) can overwrite or not (default true) */
  httpOnly: true, /** (boolean) httpOnly or not (default true) */
  signed: true, /** (boolean) signed or not (default true) */
  rolling: false, /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
  renew: true, /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/
};
