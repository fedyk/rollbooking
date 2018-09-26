import { Context } from "koa";
import { json } from "../../lib/render"
import { connect } from '../../lib/database'
import { authorize } from '../../lib/googleapis'
// import { ScheduleData } from "../../view-models/schedule/schedule-data"
import { Event as FullCalendarEvent } from "../../view-models/fullcalendar/event";
import { getSalonUser, getSalonById } from "../../queries/salons";
import { google, calendar_v3 } from "googleapis";
import { getUserCalendarId } from "../../utils/get-user-calendar-id";
import { getSalonTimezone } from "../../utils/get-salon-timezone";
import getErrorMessage from "../../utils/get-error-message";

interface BodyParams {
  start_date?: string;
  start_time?: string;
  end_time?: string;
  master_id?: string;
  client_name?: string;
  client_phone?: string;
}

export async function createEvent(ctx: Context) {
  const params = ctx.request.body as BodyParams;
  const salonId = parseInt(ctx.params.salonId, 10);

  ctx.assert(params, 400, 'Empty payload')
  ctx.assert(params.start_date, 400, 'Empty start_date')
  ctx.assert(params.start_time, 400, 'Empty start_time')
  ctx.assert(params.end_time, 400, 'Empty end_time')
  ctx.assert(params.master_id, 400, 'Empty master_id')

  const client = await connect()
  const googleAuth = await authorize();

  try {
    const masterId = parseInt(params.master_id, 10);
    const salon = await getSalonById(client, salonId);
    const user = await getSalonUser(client, salonId, masterId);
    const calendar = google.calendar({
      version: 'v3',
      auth: googleAuth
    })
    const insertResponse = await calendar.events.insert({
      calendarId: getUserCalendarId(user),
      requestBody: {
        start: {
          dateTime: new Date(params.start_date + 'T' + params.start_time).toISOString(),
          timeZone: getSalonTimezone(salon),
        },
        end: {
          dateTime: new Date(params.start_date + 'T' + params.end_time).toISOString(),
          timeZone: getSalonTimezone(salon),
        },
        summary: params.client_name || 'Client',
        description: params.client_phone,
        status: 'confirmed',
      }
    });

    const eventModel: FullCalendarEvent = {
      id: insertResponse.data.id,
      start: insertResponse.data.start.dateTime,
      end: insertResponse.data.end.dateTime,
      title: insertResponse.data.summary,
      resourceId: masterId
    };

    ctx.body = json(eventModel)


  }
  catch(e) {
    ctx.throw(e, 400)
  }

  client.release();
}
