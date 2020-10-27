import { Middleware } from 'koa';
import * as Types from '../types';
import { renderView } from '../render';
import Router = require('@koa/router');
import { getTokenById, deleteToken } from '../data-access/token';
import { ObjectID } from 'mongodb';
import { createUser } from '../data-access/users';
import { hashPassword } from '../lib/password';
import { getGravatarUrl } from '../helpers/gravatar';

export const invite: Middleware<Types.State, Types.Context> = async (ctx) => {
  const token = await getTokenById(ctx.mongo, new ObjectID(ctx.params.token))

  if (!token || !token._id) {
    throw new Error("Looks like token has expired")
  }

  if (token.type === "email-invite") {
    if (ctx.method === "POST") {
      const body = parseBody(ctx.request.body)
  
      await createUser(ctx.mongo, {
        id: token.invitee_id,
        email: token.invitee_email,
        name: body.name,
        avatarUrl: getGravatarUrl(token.invitee_email),
        password: hashPassword(body.password),
        ownedBusinessIds: [],
        defaultBusinessId: token.business_id,
        timezone: body.timezone
      })

      await deleteToken(ctx.mongo, token._id)

      /**
       * @todo: mark employee as accepted invitation
       */

      return ctx.redirect("/")
    }
  }

  ctx.state.title = "Welcome to Rollbooking!"
  ctx.state.scripts?.push("/js/vendor/jstz.min.js")
  ctx.state.scripts?.push("/js/timezone.js")
  ctx.body = await renderView("invite.ejs", {
    email: token.invitee_email
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
