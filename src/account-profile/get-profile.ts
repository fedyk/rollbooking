import { Middleware } from 'koa';
import * as Types from '../types';
import * as accounts from '../accounts';
import { getUserProfile } from "./get-user-profile"
import { getBusinessProfile } from "./get-business-profile"

export const getAccountProfile: Middleware<Types.State, Types.Context> = async (ctx, next) => {
  const account = await accounts.getById(ctx.mongoDatabase, ctx.params.id)

  if (!account) {
    return ctx.throw(404, new Error("Page does not exist"))
  }

  if (account.type === "business") {
    ctx.state.business = account
    return getBusinessProfile(ctx, next)
  }

  if (account.type === "user") {
    ctx.state.user = account
    return getUserProfile(ctx, next)
  }

  ctx.throw(404, new Error("Page does not exist"));    
}
