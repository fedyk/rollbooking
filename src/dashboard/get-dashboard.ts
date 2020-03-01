import { Middleware } from 'koa';
import * as ejs from "ejs";
import * as tz from "timezone-support";
import * as Accounts from "../accounts";
import * as Events from "../events";
import { Context, State } from '../types/app';
import { DatePicker } from '../datepicker/datepicker';
import { dateToISODate } from '../helpers/date/date-to-iso-date';

/**
 * @todo add checkbox for list of events
 */
export const getDashboard: Middleware<State, Context> = async (ctx) => {
  const userId = ctx.session ? ctx.session.userId : void 0

  if (!userId) {
    return ctx.throw(404, "Page does not exist or you have no access to it")
  }

  const user = await Accounts.getUserById(ctx.mongoDatabase, userId)

  if (!user) {
    return ctx.throw(404, "Your session has missed data about you. Please re-login again")
  }

  if (!user.business) {
    return ctx.throw(404, "User has no business associated")
  }

  const businessId = user.business.default_business_id;

  if (!businessId) {
    return ctx.throw(404, "TBD: handle when user has no salon created")
  }

  const business = await Accounts.getBusinessById(ctx.mongoDatabase, businessId)

  if (!business) {
    return ctx.throw(404, "Business does not exist in storage")
  }

  const timezone = tz.findTimeZone(business.timezone)
  const selectedDate = parseSelectedDate(ctx.request.query.date, timezone)
  const events = await Events.getMany(ctx.mongoDatabase, { businessId: businessId }).limit(100).toArray()
  const services = new Map(business.services.map(s => [s.id, s]))
  const employees = new Map(business.employees.map(e => [e.id, e]))
  const formattedEvents = formatEvents(events, services, employees)

  const datePicker = new DatePicker({
    selectedDate: selectedDate,
    urlBuilder: d => "/dashboard?date=" + dateToISODate(d)
  })

  ctx.state.title = "Welcome";
  ctx.body = await ejs.renderFile("views/dashboard/get-dashboard.ejs", {
    user: user,
    business: business,
    formattedEvents: formattedEvents,
    datePicker: datePicker
  })
}

function parseSelectedDate(date: any, timezone: ReturnType<typeof tz.findTimeZone>) {
  let selectedDate = tz.getZonedTime(new Date, timezone)

  if (date && typeof date === "string") {
    const parsedDate = new Date(date)

    if (Number.isNaN(parsedDate.getTime()) === false) {
      selectedDate = tz.getZonedTime(parsedDate, timezone)
    }
  }

  return tz.convertTimeToDate(selectedDate)
}

function formatEvents(events: Events.Event[], services: Map<string, Accounts.BusinessService>, employees: Map<string, Accounts.BusinessEmployee>) {
  return events.map(e => {
    const startHours = e.start.hours.toString().padStart(2, "0")
    const startMinutes = e.start.minutes.toString().padStart(2, "0")
    const endHours = e.end.hours.toString().padStart(2, "0")
    const endMinutes = e.end.minutes.toString().padStart(2, "0")

    /**
     * @todo service should be placed to event
     */
    const service = services.get(e.serviceId)
    const serviceName = service ? service.name : ""
    const servicePrice = service ? `${service.currencyCode}${service.price}` : ""

    /**
     * @todo all assigner information should be placed in event
     */
    const assigner = employees.get(e.assigner.id)
    const assignerName = assigner ? (assigner.name || assigner.id) : e.assigner.id

    return {
      id: e.id,
      serviceName,
      servicePrice,
      clientName: e.client ? e.client.name : "Appointment",
      time: `${startHours}:${startMinutes} - ${endHours}:${endMinutes}`,
      assignerName,
    }
  })
}