import * as koa from 'koa';
import { Context, State } from '../types/app';
import * as validators from '../validators';
import * as users from '../users';
import * as password from "../lib/password";
import { renderView } from '../render';

export const login: koa.Middleware<State, Context> = async (ctx) => {
  if (!ctx.session) {
    throw new Error("Session service is not available. Please try again later")
  }

  if (ctx.request.method === "POST") {
    const body = parseBody(ctx.request.body)
    const user = await users.findUserByCredentials(ctx.mongo, body.email, password.hash(body.password))

    if (!user) {
      throw new Error("Invalid email or password")
    }
    else {
      ctx.session.userId = user.id
      ctx.redirect("/dashboard")
    }
  }

  ctx.state.styles?.push("/css/login.css")
  ctx.body = await renderView("login.ejs")
}

function parseBody(body: any) {
  if (typeof body !== "object") {
    throw new Error("Invalid body format")
  }

  const email = String(body.email).trim().toLowerCase()
  const password = String(body.password)

  if (!validators.isEmail(email)) {
    throw new RangeError("Invalid email address");
  }


  if (password.length > 255) {
    throw new Error("Invalid password value")
  }

  return {
    email,
    password,
  }
}
