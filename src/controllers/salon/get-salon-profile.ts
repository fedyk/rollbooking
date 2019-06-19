import { Middleware } from 'koa';
import { SalonState } from './salon-middleware';
import { getSalonProfileView } from './get-salon-profile-view';

export const getSalonProfile: Middleware<SalonState> = async (ctx): Promise<void> => {
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

  ctx.state.title = `${ctx.state.salon.name} · Rollbooking`;
  ctx.body = getSalonProfileView({
    salon: ctx.state.salon
  });
}
