import { Middleware } from 'koa';
import * as ejs from "ejs";
import * as Accounts from "../accounts";
import * as Events from "../events";
import { Context, State } from '../types/app';

export const getDashboard: Middleware<State, Context> = async (ctx) => {
  const userId = ctx.session.userId

  if (!userId) {
    return ctx.throw(404, "Page does not exist or you have no access to it")
  }

  const user = await Accounts.getUserById(ctx.mongoDatabase, userId)

  if (!user) {
    return ctx.throw(404, "Your session has missed data about you. Please re-login again")
  }

  const businessId = user.business.default_business_id;

  if (!businessId) {
    return ctx.throw(404, "TBD: handle when user has no salon created")
  }

  const business = await Accounts.getBusinessById(ctx.mongoDatabase, businessId)

  const events = await Events.getMany(ctx.mongoDatabase, { businessId: businessId }).limit(100).toArray()

  ctx.state.title = "Welcome";
  ctx.body = await ejs.renderFile("views/dashboard/get-dashboard.ejs", {
    user: user,
    business: business,
    events: events
  })
}
