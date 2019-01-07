import { Context } from 'koa';
import { User } from '../../models/user';

export async function onboarding(ctx: Context): Promise<any> {
  const user = ctx.state.user as User;

  // ctx.body = await renderer('onboarding/index.njk', { user });
}
