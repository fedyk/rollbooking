import * as ejs from "ejs";
import * as Types from '../types';
import * as accounts from '../accounts';

export const getUserProfile: Types.Middleware = async (ctx) => {
  const user = ctx.state.user as accounts.User

  if (!user) {
    return ctx.throw(404, new Error("Page does not exist"))
  }

  ctx.state.title = user.name

  ctx.body = await ejs.renderFile(`views/account-profile/user-profile.ejs`, {
    account: user
  })
}
