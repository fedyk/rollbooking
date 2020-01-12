import { App$Context } from "../types";

export function getLandingPage(ctx: App$Context) {
  ctx.response.body = "Landing"
}
