import { Middleware } from "../types/app";

export const createDemoBusiness: Middleware = async (ctx) => {
  const body = parseBody(ctx.request.body)

  // create test user
  // create test salon
}

function parseBody(body: any) {
  if (typeof body !== "object") {
    throw new Error("invalid body payload")
  }

  const name = body.name

  if (typeof name !== "string" || name.length < 3 || name.length > 255) {
    throw new Error("name should be a string")
  }

  return {
    name
  }
}