import { Middleware } from 'koa';
import * as ejs from "ejs";
import * as Types from '../types';
import * as accounts from '../accounts';

export const getBusinessProfile: Types.Middleware = async (ctx) => {
  const business = ctx.state.business as accounts.Business

  if (!business) {
    return ctx.throw(404, new Error("Page does not exist"))
  }

  ctx.state.title = business.name

  ctx.body = await ejs.renderFile(`views/account-profile/business-profile.ejs`, {
    account: business
  })
}
