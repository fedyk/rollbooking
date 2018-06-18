const { connect } = require('../lib/database');
const debug = require('debug')('controller:onboarding');
const createSalonSaga = require('../sagas/create-salon-saga');

async function onboarding(ctx) {
  const { user } = ctx.state;
  const view = 'onboarding/index.html';

  await ctx.render(view, {
    user
  });
}

async function createSalon(ctx) {
  const { user } = ctx.state;
  const { body } = ctx.request;
  const client = await connect();

  debug('Start creating new salon');

  try {
    const newSalon = await createSalonSaga(body, user, client);

    debug('Successful created new salon');

    ctx.redirect(`/schedule/${newSalon.id}`);
  }
  catch(e) {
    const error = e.message || 'Something went wrong. Please try later';

    debug('Fail in attempt to create new salon. Details: %O', e);

    await ctx.render(view, {
      user,
      error
    });
  }

  client.release();
}

module.exports = onboarding;
module.exports.createSalon = createSalon;
