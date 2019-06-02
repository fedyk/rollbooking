import { Context } from "koa";
import { Salon } from "../../../types/salon";
import { parseUrlParams } from "../helpers/parse-url-params";
import { findTimeZone, getZonedTime } from "timezone-support";
import { getEvents } from "../helpers/get-events";

export async function list(ctx: Context) {
  const salon = ctx.state.salon as Salon;
  const params = parseUrlParams(ctx.query);

  const date = params.date ? params.date : getZonedTime(new Date(), findTimeZone(salon.timezone));
  const events = await getEvents(salon, date);

  ctx.body = events;
}
