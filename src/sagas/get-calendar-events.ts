import { AxiosPromise } from 'axios';
import debugFactory from 'debug'
import { calendar_v3 } from 'googleapis'

const debug = debugFactory('saga:get-calendar-events')

export default function getCalendarEvents(calendar: calendar_v3.Calendar, params: calendar_v3.Params$Resource$Events$List): AxiosPromise<calendar_v3.Schema$Events> {
  debug(`fetch calendar events for calendar ${params.calendarId}`)

  return calendar.events.list(params);
}
