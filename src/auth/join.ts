import { Middleware } from 'koa';
import { Context, State } from '../types/app';
import * as validators from '../validators';
import * as accounts from '../accounts';
import { DayOfWeek } from '../types/dat-of-week';
import { uniqId } from '../lib/uniq-id';

export const join: Middleware<State, Context> = async (ctx) => {
  const body = parseBody(ctx.request.body)

  const user: accounts.User = {
    id: uniqId(),
    type: "user",
    alias: "",
    name: body.businessName + "'s owner",
    email: body.email,
    avatar: null,
    timezone: body.timezone,
    password: body.password,
  }

  const business: accounts.Business = {
    id: uniqId(),
    type: "business",
    name: body.businessName,
    alias: getBusinessAlias(body.businessName),
    avatar: null,
    desc: null,
    timezone: body.timezone,
    employees: [{ id: user.id, role: accounts.EmployeeRole.Owner }],
    services: getDefaultServices(),
    regularHours: getDefaultHours(),
    specialHours: [],
  }

  user.business = {
    default_business_id: business.id,
    owned_business_ids: [business.id],
  }

  const result = await accounts.getCollection(ctx.mongoDatabase).insertMany([user, business])

  if (result.insertedCount !== 2) {
    throw new Error("Failed to create an user or business")
  }

  ctx.session.userId = user.id
  ctx.state.title = "Join to Rollbooking"
  ctx.redirect("/dashboard")
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

  const email = body.email

  if (typeof email !== "string") {
    throw new Error("Email should be a string")
  }

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
  return businessName.replace(/[\W_]+/g, " ");
}

function getDefaultServices(): accounts.BusinessService[] {
  return [{
    id: uniqId(),
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