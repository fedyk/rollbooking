import { Context } from 'koa';
import { User } from '../models/user';
import { welcome as welcomeView } from "../views/welcome"
import { layout } from '../views/layout';

export async function welcome(ctx: Context): Promise<any> {

  if (ctx.isAuthenticated()) {
    const user = ctx.state.user as User;

    // todo: add support for user default salon

    const userSalons = user.employers.salons;

    if (userSalons && userSalons.length > 0) {
      const [userSalon] = userSalons;

      if (userSalon && userSalon.id) {
        return ctx.redirect(`/calendar/${userSalon.id}`)
      }
    }

    // debug('user has no salons. redirect to onboarding')

    // return client.release(),
    ctx.redirect('/onboarding')
  }

  ctx.body = layout({
    content: welcomeView()
  })
}
