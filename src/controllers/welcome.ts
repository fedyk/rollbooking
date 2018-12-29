import { connect } from '../lib/database';
import { getSalonUsers, getUserSalons } from '../queries/salons'
import debugFactory from 'debug'
import { Context } from 'koa';
import { renderer } from '../lib/render';
import { User } from '../models/user';
import { getProperty } from '../utils/get-property';

const debug = debugFactory('controllers:welcome');

export async function welcome(ctx: Context): Promise<any> {
  
  if (ctx.isAuthenticated()) {
    const user = ctx.state.user as User
    const defaultSalonId = getProperty(user.properties, 'salons', 'default_salon_id');

    debug('try to get salon to show from user meta %o', defaultSalonId)

    if (defaultSalonId) {
      return ctx.redirect(`/schedule${defaultSalonId}`)
    }

    const client = await connect();
    const userSalons = user.employers.salons;

    if (userSalons && userSalons.length > 0) {
      const [userSalon] = userSalons;

      if (userSalon && userSalon.id) {
        return client.release(), ctx.redirect(`/schedule${userSalon.id}`)
      }
    }

    debug('user has no salons. redirect to onboarding')

    return client.release(), ctx.redirect('/onboarding')
  }

  ctx.body = await renderer('welcome.njk');
}
