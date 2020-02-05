import * as Types from '../../types';
import * as accounts from '../../accounts';

export const getMasters: Types.Middleware = async (ctx) => {
  const business = ctx.state.business as accounts.Business

  if (!business) {
    return ctx.throw(404, new Error("Page does not exist"))
  }
  ctx.state.title = "Masters"
  ctx.body = JSON.stringify(business.employees, null, 2)
}
