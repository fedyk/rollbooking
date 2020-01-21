import { Middleware } from 'koa';
import * as ejs from "ejs";
import { Context, State } from '../types/app';

export const getDashboard: Middleware<State, Context> = async (ctx) => {
  ctx.state.title = "Welcome";
  // console.log(__dirname +  "/../../views/dashboard/get-dashboard.ejs")
  ctx.body = await ejs.renderFile("views/dashboard/get-dashboard.ejs", {
    user: {
      id: 2
    }
  })
}

