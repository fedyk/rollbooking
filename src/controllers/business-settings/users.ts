import Router = require("@koa/router");

import { getBusinessById, pushEmployee } from "../../models/businesses";
import { renderView } from "../../render";
import { Middleware } from "../../types";
import { isEmail } from "../../validators";
import { sendEmail } from "../../email";
import { getUrl } from "../../helpers/get-url";
import { createToken, EmailInviteToken } from "../../models/token";
import { uniqId } from "../../lib/uniq-id";
import { getGravatarUrl } from "../../helpers/gravatar";

export const users: Middleware = async (ctx) => {
  const business = await getBusinessById(ctx.mongo, ctx.params.businessId)

  if (!business) {
    return ctx.throw(404, new Error("Page not found"))
  }

  if (ctx.session?.userId !== business.ownerId) {
    return ctx.throw(404, new Error("Access restricted"))
  }

  if (ctx.method === "POST") {
    const action = parseRequestAction(ctx.request.query)

    /**
     * @TODO add support of custom role
     */
    if (action === "invite-by-email") {
      const body = parseInviteByEmailBody(ctx.request.body)

      if (business.employees.find(v => v.email === body.email)) {
        ctx.state.alerts?.push({
          text: "User is already invited 👌",
          type: "success"
        })
      }
      else {
        const inviteeId = uniqId()
        const result = await pushEmployee(ctx.mongo, business.id, {
          id: inviteeId,
          name: body.email,
          avatarUrl: getGravatarUrl(body.email),
          email: body.email,
          role: "normal",
          position: void 0
        })

        if (result.matchedCount !== 1) {
          throw new Error("Ops, failed to invite")
        }

        const token = await createToken<EmailInviteToken>(ctx.mongo, {
          type: "email-invite",
          business_id: business.id,
          inviter_id: ctx.session.userId,
          invitee_id: inviteeId,
          invitee_email: body.email,
          created_at: new Date(),
        })

        await sendEmail({
          to: body.email,
          subject: `You have been invited to ${business.name}!`,
          template: "emails/invite.ejs",
          templateData: {
            businessId: business.id,
            businessName: business.name,
            url: getUrl("/invite/:token", { token: token.toHexString() }),
            inviterId: ctx.session.userId
          }
        })

        ctx.state.alerts?.push({
          text: "Invite send",
          type: "success"
        })
      }
    }
  }

  const employees = business.employees.map(function (employee) {
    return {
      name: employee.name,
      avatarUrl: employee.avatarUrl,
      role: employee.role,
      position: employee.position ?? ""
    }
  })

  ctx.state.selectedItemId = "users"
  ctx.state.title = business.name
  ctx.body = await renderView("business-settings/users.ejs", {
    name: business.name,
    employees: employees,
  })
}

function parseRequestAction(query?: object) {
  if (!query || !query["action"]) {
    throw new Error("query should contains `action` parameter")
  }

  if (query["action"] === "invite-by-email") {
    return "invite-by-email"
  }

  throw new Error("unsupported action value")
}

function parseInviteByEmailBody(body?: any) {
  const email = body?.email

  if (typeof email !== "string") {
    throw new Error("`email` is required")
  }

  if (!isEmail(email)) {
    throw new Error("`email` has invalid format")
  }

  return {
    email
  }
}