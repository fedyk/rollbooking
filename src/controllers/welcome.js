const { connect } = require('../lib/database')
const { getWorkerSalonsIds } = require('../queries/salons')
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
    const workerSalons = await getWorkerSalonsIds(client, user.id);

    if (workerSalons.length === 0) {
      debug('user has no salons. redirect to onboarding')

      return ctx.redirect('/onboarding')
    }

    return ctx.redirect(`/schedule/${workerSalons[0].salon_id}`)
  }

  await ctx.render('welcome');
}

module.exports = welcome;
