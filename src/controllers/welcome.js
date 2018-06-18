const { connect } = require('../lib/database')
const { getUserSalons } = require('../queries/users')
const debug = require('debug')('controllers:welcome')

async function welcome(ctx) {

  if (ctx.isAuthenticated()) {
    const { user } = ctx.state
    const defaultSalonId = user.meta ? user.meta.defaultSalonId : null;

    debug('try to get salon to show from user meta %o', user.meta)

    if (defaultSalonId) {
      return ctx.redirect(`/schedule/${defaultSalonId}`)
    }

    debug('user has no default salon in meta - get the first from assigned to him')

    const client = await connect();    
    const userSalons = await getUserSalons(client, user.id);

    if (userSalons.length === 0) {
      debug('user has no salons. redirect to onboarding')

      return ctx.redirect('/onboarding')
    }

    return ctx.redirect(`/schedule/${userSalons[0].salon_id}`)
  }

  ctx.render('welcome.html');
}

module.exports = welcome;