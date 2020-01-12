import { Context } from 'koa';
import { User } from '../../core/types/user';
import { renderer_DEPRECATED } from '../../lib/render';

export async function onboarding(ctx: Context): Promise<any> {
  const user = ctx.state.user as User;

  ctx.body = await renderer_DEPRECATED('onboarding/index.njk', { user });
}
