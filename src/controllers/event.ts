import * as dateFns from "date-fns";
import * as Types from '../types';
import * as accounts from '../models/businesses';
import * as users from '../models/users';
import * as events from '../models/events';
import { dateTimeToNativeDate } from "../helpers/date/date-time-to-native-date";
import { renderView } from "../render";
 
const localize = require("date-fns/locale/en-US/_lib/localize");

export const event: Types.Middleware = async (ctx) => {
  if (!ctx.session) {
    return ctx.throw(404, "Internal problem with session. please try again later");
  }

  const business = await accounts.getBusinessById(ctx.mongo, ctx.params.businessId);
  const user = ctx.state.user;
  const clientId = user ? user.id : ctx.session.clientId;
  const eventId = ctx.params.eventId;

  if (!business) {
    return ctx.throw(404, new Error("Page does not exist"));
  }

  if (!clientId) {
    return ctx.throw(404, "Page does not exist");
  }

  if (!eventId) {
    return ctx.throw(404, "Reservation does not exist");
  }

  const event = await events.findOne(ctx.mongo, {
    id: eventId,
    "client.id": clientId
  });

  if (!event) {
    return ctx.throw(404, "Reservation does not exist");
  }

  const employee = await users.getUserById(ctx.mongo, event.assigner.id);

  if (!employee) {
    return ctx.throw(404, "Reservation does not exist");
  }

  const service = business.services.find(s => s.id === event.serviceId);

  if (!service) {
    return ctx.throw(404, "Reservation does not exist");
  }

  ctx.body = await renderView(`get-event.ejs`, {
    event,
    user,
    day: event.start.day,
    month: localize.month(event.start.month - 1, { width: "abbreviated" }),
    userName: employee.name,
    serviceName: service.name,
    time: dateFns.format(dateTimeToNativeDate(event.start), "ccc, HH:mm")
  });
};
