import { Context } from '../base/types/app/context';
import { getWelcomeView } from '../views/get-welcome-view';
import { Middleware } from 'koa';
import { State } from '../base/types/app/state';

export const getWelcomePage: Middleware<State> = async (ctx): Promise<void> => {
  // if (ctx.isAuthenticated()) {
  //   const user = ctx.state.user as User
  //   const salons = user.employers.salons;
  //   if (salons && salons.length > 0) {
  //     const [userSalon] = salons;
  //     const salon = await SalonsCollection().then($salons => $salons.findOne({
  //       _id: userSalon.id
  //     }))

  //     if (salon) {
  //       return ctx.redirect(`/${salon.alias}/calendar`)
  //     }
  //   }
  //   debug('user has no salons. redirect to onboarding')
  // }

  ctx.state.title = "Rollbooking · Welcome";
  ctx.body = getWelcomeView();
}
