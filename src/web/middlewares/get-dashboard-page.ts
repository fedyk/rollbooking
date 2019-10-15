import { App$Context } from "../types";

export function getDashboardPage(ctx: App$Context) {
  ctx.response.body = "DASHBOARD"
}