import { Context } from "koa";
import { getScheduleData } from '../../sagas/schedule/get-schedule-data'

import { connect } from '../../lib/database'
import { authorize } from '../../lib/googleapis'
import { renderer } from "../../lib/render"
import UserModel from "../../models/user";
import { ScheduleData } from "../../view-models/schedule/schedule-data"
import { salonUsersToResources } from "../../utils/fullcalendar"

const debug = require('debug')('controller:schedule');

export async function schedule(ctx: Context) {
  const salonId = parseInt(ctx.params.salonId)
  const client = await connect();
  const googleAuth = await authorize();
  const currentDate = ctx.query.date ? new Date(ctx.query.date) : new Date();
  const user = ctx.state.user as UserModel;
  const viewData: ScheduleData = {
    salonId,
    user
  }

  try {
    const data = await getScheduleData({
      client,
      googleAuth,
      salonId,
      currentDate
    })

    viewData.salon = data.salon;
    viewData.salonUsers = data.salonUsers;
    viewData.resources = salonUsersToResources(data.salonUsers);
    // viewData.salonEvents = data.salonUsersEvents;
  }
  catch(e) {
    viewData.error = e;
  }

  client.release()

  ctx.body = await renderer('schedule/index.html', viewData);
}
