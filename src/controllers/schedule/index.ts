import { getScheduleData } from '../../sagas/schedule/get-schedule-data'

const debug = require('debug')('controller:schedule');
import { connect } from '../../lib/database'
import { authorize } from '../../lib/googleapis'
import { renderer } from '../../lib/render'
import { ScheduleData } from '../../view-models/schedule/schedule-data'

export async function schedule(ctx) {
  const salonId = parseInt(ctx.params.salonId)
  const client = await connect();
  const googleAuth = await authorize();
  const currentDate = ctx.query.date ? new Date(ctx.query.date) : new Date()
  const { user } = ctx.state;
  let scheduleData;

  try {
    const scheduleData = await getScheduleData({
      client,
      googleAuth,
      salonId,
      currentDate
    })
  }
  catch(e) {
    throw e
  }

  const viewData: ScheduleData = {
    salonId: salonId,
    salon: scheduleData.salon,
    salonEvents: scheduleData.salonEvents,
    salonUsers: scheduleData.salonUsers
  }

  ctx.body = await renderer('schedule/index.html', viewData)

  client.release()
}
