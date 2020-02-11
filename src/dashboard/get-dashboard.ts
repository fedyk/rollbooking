import { Middleware } from 'koa';
import * as ejs from "ejs";
import * as accounts from "../accounts";
import { Context, State } from '../types/app';

export const getDashboard: Middleware<State, Context> = async (ctx) => {
  const userId = ctx.session.userId;
  const user = userId ? await accounts.getById(ctx.mongoDatabase, userId) : void 0;

  ctx.state.title = "Welcome";
  ctx.body = await ejs.renderFile("views/dashboard/get-dashboard.ejs", {
    user: user
  })
}
