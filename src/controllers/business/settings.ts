import * as accounts from '../../account'
import { Middleware } from "./layout"

export const getSettings: Middleware = async (ctx) => {
  const business = ctx.state.business as accounts.Account

  if (!business) {
    return ctx.throw(404, new Error("Page does not exist"))
  }
  ctx.state.activeTab = "settings"
  ctx.state.title = "Settings"
  ctx.body = JSON.stringify(business, null, 2)
}
