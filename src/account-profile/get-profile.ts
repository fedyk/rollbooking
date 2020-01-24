import { Middleware } from 'koa';
import * as ejs from "ejs";
import * as Types from '../types';
import * as accounts from '../accounts';

export const getAccountProfile: Middleware<Types.State, Types.Context> = async (ctx) => {
  const account = await accounts.getById(ctx.mongoDatabase, ctx.params.id)

  if (!account) {
    return ctx.throw(404, new Error("Page does not exist"))
  }

  ctx.state.title = account.name
  ctx.state.scripts.push("/js/account.js")

  ctx.body = await ejs.renderFile(`views/account-profile/business.ejs`, {
    account
  })
}
