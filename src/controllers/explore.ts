import { Middleware } from 'koa';
import * as ejs from "ejs";
import * as Types from '../types';
import * as accounts from '../data-access/businesses';
import { renderView } from '../render';
import Router = require('@koa/router');

export const explore: Middleware<Types.State, Types.Context> = async (ctx) => {
  const businesses = await accounts.getRecentBusinesses(ctx.mongo)

  ctx.state.title = "Explore salons"
  ctx.body = await renderView("explore.ejs", {
    items: businesses.map(function(b) {
      return {
        name: b.name,
        createdAt: b.createdAt,
        url: Router.url("/business/:businessId", {
          businessId: b.id,
        })
      }
    })
  })
}
