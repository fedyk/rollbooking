import * as koa from 'koa';
import { Middleware } from '../types/app';
import { renderView } from '../render';
import { hashPassword } from '../lib/password';
import { isEmail } from '../lib/is-email';

export const login: Middleware = async (ctx) => {
  if (!ctx.session) {
    throw new Error("Session service is not available. Please try again later")
  }

  if (ctx.request.method === "POST") {
    const body = parseBody(ctx.request.body)
    const user = await ctx.users.findUserByCredentials(body.email, hashPassword(body.password))

    if (!user) {
      throw new Error("Invalid email or password")
    }
    else {
      ctx.session.userId = user._id.toHexString()
      ctx.redirect("/calendar")
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

  if (!isEmail(email)) {
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
