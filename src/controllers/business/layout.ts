import * as koa from 'koa';
import * as ejs from "ejs";
import * as types from '../../types';
import * as accounts from '../../accounts';

export const layout: types.Middleware = async (ctx, next) => {
  const business = await accounts.getById(ctx.mongoDatabase, ctx.params.id)

  if (!business) {
    return ctx.throw(404, new Error("Page does not exist"))
  }

  if (business.type !== "business") {
    return ctx.throw(404, new Error("Business does not exist"))
  }

  ctx.state.business = business

  await next()

  ctx.body = await ejs.renderFile(`views/business-layout.ejs`, {
    business: business,
    body: ctx.body
  })
}
