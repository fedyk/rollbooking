import { Middleware } from 'koa';
import * as ejs from "ejs";
import * as Types from '../../types';
import * as accounts from '../../account';

export const getExplore: Middleware<Types.State, Types.Context> = async (ctx) => {
  const businesses = await accounts.getRecentBusinesses(ctx.mongo)

  ctx.state.title = "Explore salons"

  ctx.body = await ejs.renderFile(`views/explore/explore.ejs`, {
    businesses
  })
}
