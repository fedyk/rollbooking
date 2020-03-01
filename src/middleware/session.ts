import * as types from "../types";
import * as accounts from "../accounts";

/**
 * @example
 * 
 * router.get("/", session, (ctx) => {
 *   const user = ctx.state.user
 * })
 */
export const session: types.Middleware = async(ctx, next) => {
  if (ctx.session) {
    const userId = ctx.session.userId
  
    if (userId && !ctx.state.user) {
      ctx.state.user = await accounts.getUserById(ctx.mongoDatabase, userId)
    }
  }

  await next()
}
