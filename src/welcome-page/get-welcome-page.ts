import { Middleware } from 'koa';
import { Context, State } from '../types/app';
import { getWelcomeView } from './get-welcome-view';

export const getWelcomePage: Middleware<State, Context> = async (ctx) => {
  ctx.state.title = "Welcome";
  ctx.state.scripts.push("/js/vendor/jstz.min.js")
  ctx.state.scripts.push("/js/welcome.js")
  ctx.body = getWelcomeView();
}
