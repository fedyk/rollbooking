import { Middleware } from '../types/app';
import { DayOfWeek } from '../types/dat-of-week';
import { renderView } from '../render';
import { getGravatarUrl } from '../helpers/gravatar';
import { isEmail } from '../lib/is-email';
import { Service } from '../data-access/organizations';
import { ObjectID } from 'mongodb';
import { hashPassword } from '../lib/password';
import { formatPrice } from '../helpers/format-price';
import { format } from 'date-fns';
import { dateTimeToNativeDate } from '../helpers/date-time-to-native-date';

export const welcome: Middleware = async (ctx, next) => {
  if (ctx.state.user) {
    return dashboard(ctx, next)
  }

  if (ctx.request.method === "POST") {
    const body = parseBody(ctx.request.body)
    const user = parseUser(body)
    const { insertedId: userId } = await ctx.users.createUser(user)
    const services = getDefaultServices()
    const { insertedId: organizationId } = await ctx.organizations.create({
      name: body.businessName,
      avatarUrl: `/images/business-avatar-${body.businessName.charCodeAt(0) % 3}.png`,
      description: "",
      timezone: body.timezone,
      creatorId: userId,
      users: [{
        id: userId,
        name: user.name,
        avatarUrl: user.avatarUrl,
        role: "owner",
        position: "",
      }],
      services: services,
      regularHours: getDefaultHours(),
      specialHours: [],
      createdAt: new Date,
      updatedAt: new Date
    })

    ctx.session.userId = userId.toHexString()

    return ctx.redirect("/salon/" + organizationId)
  }

  ctx.state.title = "Welcome"
  ctx.state.scripts?.push("/js/vendor/jstz.min.js")
  ctx.state.scripts?.push("/js/timezone.js")
  ctx.body = await renderView("welcome.ejs")
}

const dashboard: Middleware = async (ctx, next) => {
  const userId = ctx.state.user?._id

  if (!userId) {
    throw new Error("Not available")
  }
 
  const reservations = await ctx.reservations.findByCustomerId(userId)

  const items = reservations.map(reservation => {
    const  start = dateTimeToNativeDate(reservation.start)
    const end = dateTimeToNativeDate(reservation.end)
    return {
      serviceName: reservation.service.name,
      assigneeName: reservation.assignee.name,
      assigneeUrl: `/salon/${reservation.assignee.id}`,
      organizationName: reservation.organization.name,
      organizationUrl: `/salon/${reservation.organization.id}`,
      startEndTime: `${format(start, "MMM LL, HH:mm")} - ${format(end, "HH:mm")}`,
      price: formatPrice(reservation.service.price, reservation.service.currencyCode),
    }
  })

  ctx.body = await renderView("dashboard.ejs", {
    reservations: items
  })
}

function parseBody(body: any) {
  let businessName = String(body?.business_name).trim()
  let email = String(body?.email ?? "").trim().toLowerCase()
  let timezone = String(body?.timezone).trim()
  let password = body?.password

  // use some default name
  if (businessName.length < 1) {
    businessName = "roll salon 💈"
  }

  if (!isEmail(email)) {
    throw new Error("Invalid email format");
  }

  if (typeof timezone !== "string") {
    throw new Error("timezone should be a string")
  }

  return {
    businessName,
    email,
    password,
    timezone
  }
}

function getDefaultServices(): Service[] {
  return [{
    id: new ObjectID(),
    name: "Hair cut",
    description: "",
    duration: 30,
    currencyCode: "USD",
    price: 50,
  }]
}

function getDefaultHours() {
  return [
    DayOfWeek.MONDAY,
    DayOfWeek.TUESDAY,
    DayOfWeek.WEDNESDAY,
    DayOfWeek.THURSDAY,
    DayOfWeek.FRIDAY,
  ].map(d => ({
    openDay: d,
    closeDay: d,
    openTime: {
      hours: 9,
      minutes: 0,
      seconds: 0,
    },
    closeTime: {
      hours: 18,
      minutes: 0,
      seconds: 0,
    }
  }))
}

function parseUser(body: ReturnType<typeof parseBody>) {
  return {
    name: body.businessName + "'s owner",
    email: body.email,
    phone: "",
    avatarUrl: getGravatarUrl(body.email),
    timezone: body.timezone,
    password: hashPassword(body.password),
    createdAt: new Date(),
    updatedAt: new Date(),
  }
}