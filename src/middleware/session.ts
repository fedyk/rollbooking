import * as types from "../types";
import * as accounts from "../users";

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
      ctx.state.user = await accounts.getUserById(ctx.mongo, userId) || void 0
    }
  }

  await next()
}
