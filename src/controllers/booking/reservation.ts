import * as parseInt from "parse-int";
import { layout as layoutView } from "../../views/booking/layout";
import { connect } from "../../lib/database";
import { getSalonById } from "../../queries/salons";
import { Context } from "koa";
import { salonsReservations } from "../../adapters/mongodb";
import { ObjectId } from "bson";

export async function reservation(ctx: Context) {
  const salonId = parseInt(ctx.params.salonId);
  const reservationId = ctx.query && ctx.query.id + '';
  const database = await connect();
  const reservationsCollections = await salonsReservations();

  try {
    const salon = await getSalonById(database, salonId);

    ctx.assert(salon, 404, "Page doesn't exist");
    ctx.assert(reservationId, 404, "Page doesn't exist");

    const reservation = await reservationsCollections.findOne({
      _id: new ObjectId(reservationId)
    })

    ctx.assert(reservation, 404, "Reservation doesn't exist")

    ctx.body = layoutView({
      title: "Test Salon",
      body: `<pre>${JSON.stringify(reservation)}</pre>
      `
    })
  }
  catch(e) {
    throw e;
  }
  finally {
    database.release();
  }
}
