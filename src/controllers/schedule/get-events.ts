import { Context } from "koa";
import { getScheduleData } from '../../sagas/schedule/get-schedule-data'

import { connect } from '../../lib/database'
import { authorize } from '../../lib/googleapis'
import { json } from "../../lib/render"
import { ScheduleData } from "../../view-models/schedule/schedule-data"
import { Event as FullCalendarEvent } from "../../view-models/fullcalendar/event"

const debug = require('debug')('controller:schedule:get-events');

export async function getEvents(ctx: Context, next: () => Promise<any>) {
  ctx.assert('start', 400, 'Missed start parameter');
  ctx.assert('end', 400, 'Missed end parameter');

  const endDate = (): string => {
    const end = new Date();
    end.setHours(end.getHours() + 1);
    return end.toISOString();
  }

  ctx.body = json([
    {
      id: '1',
      title: 'test',
      resourceId: 1,
      start: new Date().toISOString(),
      end: endDate(),
    }
  ] as FullCalendarEvent[])

  await next();
}
