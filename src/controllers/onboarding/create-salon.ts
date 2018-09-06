import { ok } from "assert";
import { connect } from "../../lib/database";
import { createSalonSaga } from '../../sagas/create-salon-saga';
import debugFactory from 'debug'
import { Context } from "koa";
import { User } from "../../models/user";
import { renderer } from "../../lib/render";
import { Salon } from "../../models/salon";

const debug = debugFactory('controller:onboarding')

interface CreateSalonBody {
  name?: string;
  timezone?: string;
}

export async function createSalon(ctx: Context): Promise<any> {
  const user = ctx.state.user as User;
  const body = ctx.request.body as CreateSalonBody;
  const client = await connect();

  ctx.assert(body, 400, 'Empty body')
  ctx.assert(body.name, 400, 'Empty salon name')
  ctx.assert(body.timezone, 400, 'Empty salon timezone')

  try {
    const salonData: Salon = {
      id: null,
      name: body.name || 'Untitled salon',
      properties: {
        general: {
          timezone: body.timezone
        }
      },
      created: new Date(),
      updated: new Date(),
    };

    const salonModel = await createSalonSaga(client, salonData, user);

    debug('Successful created new salon');

    ctx.redirect(`/schedule/${salonModel.id}`);
  }
  catch(e) {
    const error = e.message || 'Something went wrong. Please try later';

    debug('Fail in attempt to create new salon. Details: %O', e);

    ctx.body = await renderer('onboarding/index.njk', { user, error });
  }

  client.release();
}
