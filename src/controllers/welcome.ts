import Debug from 'debug'
import { Context } from 'koa';
import { renderer } from '../lib/render';
import { User } from '../models/user';
import { SalonsCollection } from '../adapters/mongodb';

const debug = Debug('controllers:welcome');

export async function welcome(ctx: Context): Promise<any> {

  if (ctx.isAuthenticated()) {
    const user = ctx.state.user as User
    const salons = user.employers.salons;

    if (salons && salons.length > 0) {
      const [userSalon] = salons;
      const salon = await SalonsCollection().then($salons => $salons.findOne({
        _id: userSalon.id
      }))

      if (salon) {
        return ctx.redirect(`/${salon.alias}/calendar`)
      }
    }

    debug('user has no salons. redirect to onboarding')
  }

  ctx.body = await renderer('welcome.njk');
}
