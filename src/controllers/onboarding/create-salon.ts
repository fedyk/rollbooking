import debugFactory from 'debug'
import { Context } from "koa";
import { User } from "../../types/user";
import { renderer } from "../../lib/render";
import { Salon } from "../../types/salon";
import { DayOfWeek } from "../../types/dat-of-week";
import { SalonsCollection } from "../../adapters/mongodb";
import { ObjectID } from "bson";

const debug = debugFactory('controller:onboarding')

interface CreateSalonBody {
  name?: string;
  timezone?: string;
}

export async function createSalon(ctx: Context): Promise<any> {
  const user = ctx.state.user as User;
  const body = ctx.request.body as CreateSalonBody;

  ctx.assert(body, 400, 'Empty body')
  ctx.assert(body.name, 400, 'Empty salon name')
  ctx.assert(body.timezone, 400, 'Empty salon timezone')
  ctx.assert(user._id, 500, "INternal error: broken user model")
  ctx.assert(user._id instanceof ObjectID, 500, "INternal error: broken user identifier")

  try {
    const salonData: Salon = {
      _version: "v2",
      description: "",
      alias: "..",
      regularHours: {
        periods: [{
          openDay: DayOfWeek.DAY_OF_WEEK_UNSPECIFIED,
          openTime: {
            hours: 10,
            minutes: 0,
            seconds: 0
          },
          closeDay: DayOfWeek.DAY_OF_WEEK_UNSPECIFIED,
          closeTime: {
            hours: 18,
            minutes: 0,
            seconds: 0
          }
        }]
      },
      services: {
        lastServiceId: 0,
        items: []
      },
      employees: {
        users: [{
          id: user._id,
          position: "Administrator",
        }]
      },
      specialHours: {
        periods: []
      },
      timezone: body.timezone,
      name: body.name || 'Untitled salon',
      created: new Date(),
      updated: new Date(),
    };

    const $salons = await SalonsCollection()

    const insertResult = await $salons.insertOne(salonData);

    debug('Successful created new salon');

    ctx.redirect(`/schedule/${insertResult.insertedId.toHexString()}`);
  }
  catch(e) {
    const error = e.message || 'Something went wrong. Please try later';

    debug('Fail in attempt to create new salon. Details: %O', e);

    ctx.body = await renderer('onboarding/index.njk', { user, error });
  }
}
