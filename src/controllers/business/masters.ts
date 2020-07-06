import * as ejs from "ejs"
import * as accounts from '../../account';
import { Middleware} from "./layout"

export const getMasters: Middleware = async (ctx) => {
  const business = ctx.state.business as accounts.Account

  if (!business) {
    return ctx.throw(404, new Error("Page does not exist"))
  }

  ctx.state.activeTab = "masters"
  ctx.state.title = "Masters"
  ctx.body = await ejs.renderFile(`views/business/masters.ejs`, {
    account: business,
    masters: business.employees
  })
}
