const debug = require('debug')('controller:schedule');
const { connect } = require('../../lib/database');
const { authorize } = require('../../lib/googleapis');
const getScheduleData = require('../../sagas/schedule/get-schedule-data')

module.exports = schedule;

async function schedule(ctx) {
  const salonId = parseInt(ctx.params.salonId)
  const client = await connect();
  const googleAuth = await authorize();
  const currentDate = ctx.query.date ? new Date(ctx.query.date) : new Date()

  const { user } = ctx.state;
  const locals = {
    error: null,
    salonId,
    user,
    salonUsers: [],
    salonServices: [],
    salonUsersEvents: [],
  }

  try {
    const { salon, salonUsers, salonServices, salonUsersEvents } = await getScheduleData({
      client,
      googleAuth,
      salonId,
      currentDate
    })

    locals.salon = salon;
    locals.salonUsers = salonUsers;
    locals.salonServices = salonServices;
    locals.salonUsersEvents = salonUsersEvents;
  }
  catch(e) {
    locals.error = e.message || 'Something went wrong. Please try later';

    debug('Fail to get all needed data for rendering schedule page. Details: %O', e);
  }

  ctx.render('schedule/index.html', locals);

  client.release()
}
