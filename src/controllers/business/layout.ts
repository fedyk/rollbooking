import * as koa from 'koa';
import * as ejs from "ejs";
import * as types from '../../types';
import * as accounts from '../../account';

export type Middleware = types.Middleware<{
  activeTab: "default" | "masters" | "settings"
  business: accounts.Account
}>

export const layout: Middleware = async (ctx, next) => {
  const business = await accounts.getBusinessById(ctx.mongo, ctx.params.id)

  if (!business) {
    return ctx.throw(404, new Error("Page does not exist"))
  }

  ctx.state.activeTab = "default"
  ctx.state.business = business

  await next()

  ctx.body = await ejs.renderFile(`views/business-layout.ejs`, {
    activeTab: ctx.state.activeTab,
    business: business,
    body: ctx.body
  })
}
