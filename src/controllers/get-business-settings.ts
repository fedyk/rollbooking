import * as Types from '../types';
import * as accounts from '../accounts';

export const getBusinessSettings: Types.Middleware = async (ctx) => {
  const business = ctx.state.business as accounts.Business

  if (!business) {
    return ctx.throw(404, new Error("Page does not exist"))
  }
  ctx.state.title = "Settings"
  ctx.body = JSON.stringify(business, null, 2)
}
