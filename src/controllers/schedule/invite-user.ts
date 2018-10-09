import { Context } from "koa";
import debugFactory from "debug";
import { connect } from "../../lib/database"
import { authorize } from "../../lib/googleapis"
import { User } from "../../models/user";
import { renderer } from "../../lib/render";
import { getSalonTimezone } from "../../utils/get-salon-timezone";
import { getUserTimezone } from "../../utils/get-user-timezone";
import { getSalonById, getSalonUsers } from "../../queries/salons";
import { inviteUserToSalon } from "../../sagas/invite-user-to-salon";
import { isEmail } from "../../utils/is-email";
import { SalonUserRole } from "../../models/salon-user";
// import { json } from "../../lib/render"
// import { Event as FullCalendarEvent } from "../../view-models/fullcalendar/event";
// import { google } from "googleapis";
// import { getSalonUsers } from "../../sagas/get-salon-users";
// import { getUserCalendarId } from "../../utils/get-user-calendar-id";
// import { getSalonById } from "../../queries/salons";
// import { getSalonTimezone } from "../../utils/get-salon-timezone";
// import { toFullcalendarEvent } from "../../mappers/google/to-fullcalendar-event";
// import { isValidDate } from "../../utils/is-valid-date";

const debug = debugFactory('schedule:invite-user');

interface Body {
  email?: string;
  name?: string;
  role?: string;
}

export async function inviteUser(ctx: Context) {
  const body = ctx.request.body as Body;
  const currentUser = ctx.state.user as User;
  const salonId = parseInt(ctx.params.salonId, 10);

  ctx.assert(body, 400, "Empty payload")
  ctx.assert(body.email, 400, "Empty email")
  ctx.assert(isEmail(body.email), 400, "Invalid email")
  ctx.assert(body.name, 400, "Empty name")
  ctx.assert(body.name.length <= 64, 400, "Too long name")

  const client = await connect()
  const salon = await getSalonById(client, salonId);
  const inviteUser: User = {
    id: null,
    google_id: null,
    email: body.email,
    properties: {
      general: {
        name: body.name,
        role: body.role || '',
        timezone: getSalonTimezone(salon)
      }
    },
    password: null,
    logins: 0,
    last_login: null,
    created: new Date,
    updated: new Date,
  };

  try {
    await inviteUserToSalon(client, salonId, inviteUser, currentUser.id, SalonUserRole.Member);
  }
  catch(e) {
    return ctx.throw(e);
  }
  const salonUsers = await getSalonUsers(client, salonId);

  client.release();
  ctx.type = 'application/json';
  ctx.body = await renderer("schedule/invite-user.html", {
    salonId,
    salonUsers
  })
}
