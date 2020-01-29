import { Middleware } from 'koa';
import * as tz from "timezone-support";
import * as ejs from "ejs";
import * as Types from '../types';
import * as accounts from '../accounts';
import { Booking, Slot } from '../booking';

export const getBusinessProfile: Types.Middleware = async (ctx) => {
  const business = ctx.state.business as accounts.Business

  if (!business) {
    return ctx.throw(404, new Error("Page does not exist"))
  }

  ctx.state.title = business.name

  const booking = new Booking(business, [])
  const slots = booking.getNearestSlots()
  const servicesSlots = combine(slots, business.services)

  ctx.body = await ejs.renderFile(`views/account-profile/business-profile.ejs`, {
    account: business,
    services: business.services,
    slots: slots,
    servicesSlots: servicesSlots,
  })
}


function combine(slots: Slot[], services: accounts.BusinessService[]) {
  return services.map(function (service) {
    const serviceSlots = slots.filter(s => s.serviceId === service.id)
    const uniqSlots = new Map<number, Slot>(serviceSlots.map(function(slot) {
      return [tz.getUnixTime(slot.start), slot]
    }))

    return Array.from(uniqSlots.values())
  })
}