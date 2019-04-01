import { Context } from "koa";

export async function bookingContentMiddleware(ctx: Context, next) {  
  ctx.state.styles.push("/packages/bootstrap/booking.css?1");
  ctx.state.styles.unshift("https://fonts.googleapis.com/icon?family=Material+Icons");
  ctx.state.scripts.push("/packages/bootstrap/booking.js?1");

  await next()

  ctx.body = `<div class="booking-container">${ctx.body}</div>`; 
}
