import * as koa from 'koa';
import { Context, State } from '../types/app';
import * as validators from '../validators';
import * as accounts from '../models/businesses';
import * as users from '../models/users';
import * as password from "../lib/password";
import { DayOfWeek } from '../types/dat-of-week';
import { uniqId } from '../lib/uniq-id';
import { renderView } from '../render';
import { getGravatarUrl } from '../helpers/gravatar';

export const welcome: koa.Middleware<State, Context> = async (ctx) => {
  if (!ctx.session) {
    throw new Error("Internal issue with sessions services. Please try again later")
  }

  if (ctx.state.user) {
    return ctx.redirect("/calendar")
  }

  if (ctx.request.method === "POST") {

    const body = parseBody(ctx.request.body)

    const user: users.User = {
      id: uniqId(),
      name: body.businessName + "'s owner",
      email: body.email,
      avatarUrl: getGravatarUrl(body.email),
      timezone: body.timezone,
      password: password.hashPassword(body.password),
      defaultBusinessId: null,
      ownedBusinessIds: [],
    }

    const services = getDefaultServices()

    const business: accounts.Business = {
      id: uniqId(),
      name: body.businessName,
      alias: getBusinessAlias(body.businessName),
      avatarUrl: "",
      description: "",
      timezone: body.timezone,
      ownerId: user.id,
      employees: [{
        id: user.id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
        role: "owner",
        position: "",
      }],
      services: services,
      servicesCount: services.length,
      regularHours: getDefaultHours(),
      specialHours: [],
      createdAt: new Date,
      updatedAt: new Date
    }

    user.defaultBusinessId = business.id
    user.ownedBusinessIds = [business.id]

    const result1 = await accounts.createAccount(ctx.mongo, business)
    const result2 = await users.createUser(ctx.mongo, user)

    // todo: get check

    ctx.session.userId = user.id
    return ctx.redirect("/calendar")
  }

  ctx.state.title = "Welcome"
  ctx.state.scripts?.push("/js/vendor/jstz.min.js")
  ctx.state.scripts?.push("/js/timezone.js")
  ctx.body = await renderView("welcome.ejs")

}

function parseBody(body: any) {
  if (typeof body !== "object") {
    throw new Error("Invalid body format")
  }

  const businessName = body.business_name

  if (typeof businessName !== "string") {
    throw new Error("Business name should be a string");
  }

  if (businessName.length < 3 || businessName.length > 200) {
    throw new Error("Business name should be somewhat between 2 and 200 characters");
  }

  let email = body.email

  if (typeof email !== "string") {
    throw new Error("Email should be a string")
  }

  email = email.trim().toLowerCase()

  if (!validators.isEmail(email)) {
    throw new Error("Invalid email format");
  }

  const password = body.password

  if (typeof password !== "string") {
    throw new Error("Password should be a string")
  }

  if (password.length < 6 || password.length > 30) {
    throw new Error("Password should be be somewhat between 6 and 30 characters")
  }

  const timezone = body.timezone

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

function getBusinessAlias(businessName: string): string {
  let alias = businessName.replace(/[\W_]+/g, " ");

  alias = alias.toLowerCase()

  if (alias.length < 3) {
    alias += 100 + Math.round(Math.random() * 900) // 100 - 999
  }

  return alias
}

function getDefaultServices(): accounts.Service[] {
  return [{
    id: 1,
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
