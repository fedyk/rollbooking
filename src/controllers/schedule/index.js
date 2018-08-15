const { connect } = require('../../lib/database');
const { authorize } = require('../../lib/googleapis');
const debug = require('debug')('controller:schedule');
const getSalonUsers = require('../../sagas/get-salon-users');
const getScheduleEvents = require('../../sagas/get-schedule-events');

module.exports = schedule;

async function schedule(ctx) {
  const salonId = parseInt(ctx.params.salonId)
  const client = await connect();
  const googleAuth = await authorize();
  const date = ctx.query.date ? new Date(ctx.query.date) : new Date()

  const { user } = ctx.state;
  const locals = {
    error: null,
    salonId,
    user,
    salonUsers: [],
    userEvents: [],
  }

  try {
    locals.salonUsers = await getSalonUsers(client, salonId)
    locals.userEvents = await getScheduleEvents(googleAuth, locals.salonUsers)
  }
  catch(e) {
    locals.error = e.message || 'Something went wrong. Please try later';

    debug('Fail to get all needed data for rendering schedule page. Details: %O', e);
  }

  ctx.render('schedule/index.html', locals);

  client.release()
}
