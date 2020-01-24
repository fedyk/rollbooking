import { Middleware } from 'koa';
import * as types from '../types';
import { getWelcomeView } from './get-welcome-view';

export const getWelcomePage: types.Middleware = async (ctx) => {
  if (ctx.state.user) {
    return ctx.redirect("/dashboard")
  }

  ctx.state.title = "Welcome";
  ctx.state.scripts.push("/js/vendor/jstz.min.js")
  ctx.state.scripts.push("/js/welcome.js")
  ctx.body = getWelcomeView();
}
