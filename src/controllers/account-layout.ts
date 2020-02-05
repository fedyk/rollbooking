import { Middleware } from 'koa';
import * as ejs from "ejs";
import * as Types from '../types';
import * as accounts from '../accounts';

export const accountLayout: Middleware<Types.State, Types.Context> = async (ctx, next) => {
  const account = await accounts.getById(ctx.mongoDatabase, ctx.params.id)

  if (!account) {
    return ctx.throw(404, new Error("Page does not exist"))
  }

  if (account.type === "user") {
    return ctx.throw(404, new Error("User is not supported yet"))
  }

  ctx.state.business = account

  await next()

  ctx.body = await ejs.renderFile(`views/business-layout.ejs`, {
    business: account,
    body: ctx.body
  })
}
