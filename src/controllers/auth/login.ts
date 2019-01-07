import { Context } from "koa";
import { loginView } from "../../views/auth/login-view";

export async function login(ctx: Context) {
  ctx.body = loginView();
}
