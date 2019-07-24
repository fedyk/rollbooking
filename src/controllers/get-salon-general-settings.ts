import { Middleware } from 'koa';
import { SalonState } from '../middleware/salon-middleware';
import { getSalonGeneralSettingView } from '../views/get-salon-general-setting-view';

export const getSalonGeneralSettings: Middleware<SalonState> = async (ctx): Promise<void> => {
  ctx.state.title = `${ctx.state.salon.name} · Settings`;
  ctx.body = getSalonGeneralSettingView({
    salon: ctx.state.salon
  });
}
