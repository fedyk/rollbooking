import { Context } from "koa";
import debugFactory from "debug";
import { connect } from "../../lib/database"
import { authorize } from "../../lib/googleapis"
import { json } from "../../lib/render"
import { Event as FullCalendarEvent } from "../../view-models/fullcalendar/event";
import { google } from "googleapis";
import { getSalonUsers } from "../../sagas/get-salon-users";
import { getUserCalendarId } from "../../utils/get-user-calendar-id";
import { getSalonById } from "../../queries/salons";
import { getSalonTimezone } from "../../utils/get-salon-timezone";
import { toFullcalendarEvent } from "../../mappers/google/to-fullcalendar-event";
import { isValidDate } from "../../utils/is-valid-date";

const debug = debugFactory('schedule:get-events');

interface Body {
  start?: string;
  end?: string;
  timezone?: string;
}

export async function getEvents(ctx: Context, next: () => Promise<any>) {
  const salonId = parseInt(ctx.params.salonId, 10);
  const params = ctx.request.query as Body;
  
  ctx.assert(params, 400, 'Empty request params');
  ctx.assert(params.start, 400, 'Empty start param');
  ctx.assert(params.end, 400, 'Empty end param');

  const timeMin = new Date(params.start);
  const timeMax = new Date(params.end);

  ctx.assert(isValidDate(timeMin), 400, 'Invalid start time');
  ctx.assert(isValidDate(timeMax), 400, 'Invalid end time');

  const client = await connect();
  const googleAuth = await authorize();
  const calendar = google.calendar({
    version: 'v3',
    auth: googleAuth
  });
  const salon = await getSalonById(client, salonId);
  const timeZone = params.timezone || getSalonTimezone(salon);
  const salonUsers = await getSalonUsers(client, salonId);
  const eventsRequests = salonUsers.map(salonUser => {
    return calendar.events.list({
      calendarId: getUserCalendarId(salonUser),
      timeMin: timeMin.toISOString(),
      timeMax: timeMax.toISOString(),
      timeZone: timeZone
    }).then(response => {
      const items = response.data.items || [];

      return items.map(item => toFullcalendarEvent(item, salonUser.user_id))
    })
    .catch(error => {
      debug(`Error in fetching event for ${salonUser.user_id}. %s`, error)
      return [];
    })
  })

  const salonUsersEvents = await Promise.all(eventsRequests);
  const events = salonUsersEvents.reduce((curr: Array<FullCalendarEvent>, v: Array<FullCalendarEvent>) => {
    return curr.concat(v)
  }, []);

  ctx.body = json(events)

  await next();
}
