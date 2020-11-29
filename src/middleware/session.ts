import { Middleware } from "../types";

export const session: Middleware = async (ctx, next) => {
  const userId = ctx.session.userId

  if (userId && !ctx.state.user) {
    const user = await ctx.users.getUserById(userId)

    if (user) {
      ctx.state.user = user
    }
  }

  await next()
}
