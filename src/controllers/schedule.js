const { connect } = require('../lib/database');
const debug = require('debug')('controller:schedule');
const getSalonScheduleData = require('../sagas/get-salon-schedule-data');

async function schedule(ctx) {
  const salonId = parseInt(ctx.params.salonId)
  const client = await connect();
  const { user } = ctx.state

  try {
    const { users } = await getSalonScheduleData(salonId, client)

    await ctx.render('schedule/index', {
      user,
      users
    });
  }
  catch(e) {
    const error = e.message || 'Something went wrong. Please try later';

    debug('Fail to get all needed data for rendering schedule page. Details: %O', e);

    await ctx.render('schedule/index', {
      user,
      error
    });
  }

  client.release()
}

module.exports = schedule;
