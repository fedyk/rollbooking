import { Middleware } from '../types';
import { renderView } from '../render';
import { ObjectID } from 'mongodb';
import { hashPassword } from '../lib/password';
import { getGravatarUrl } from '../helpers/gravatar';

export const invite_TO_REWORK: Middleware = async (ctx) => {
  const token = await ctx.invitations.getById(new ObjectID(ctx.params.token))

  if (!token) {
    throw new Error("Token has expired, please ask for a new invite")
  }

  if (ctx.method === "POST") {
    const body = parseBody(ctx.request.body)

    const result = await ctx.users.createUser({
      email: token.email,
      name: body.name,
      avatarUrl: getGravatarUrl(token.email),
      password: hashPassword(body.password),
      timezone: body.timezone,
      phone: "",
      createdAt: new Date(),
      updatedAt: new Date()
    })

    // await ctx.organizations.addMember(token.organizationId, {
    //   id: result.insertedId,
    //   name: body.name,
    //   role: "normal",
    //   position: token.position,
    // })

    await ctx.invitations.delete(token._id)

    return ctx.redirect("/")
  }

  ctx.state.title = "Welcome to Rollbooking!"
  ctx.state.scripts?.push("/js/vendor/jstz.min.js")
  ctx.state.scripts?.push("/js/timezone.js")
  ctx.body = await renderView("invite.ejs", {
    email: token.email
  })
}

function parseBody(body?: any) {
  const name = body?.name
  const password = body?.password
  const timezone = body?.timezone

  if (typeof name !== "string") {
    throw new Error("`name` is required")
  }

  if (typeof password !== "string") {
    throw new Error("`password` is required")
  }

  if (typeof timezone !== "string") {
    throw new Error("`timezone` is required")
  }

  return {
    name: name.trim(),
    password: password,
    timezone: timezone
  }
}
