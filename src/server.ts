import * as config from "./config"
import * as Koa from "koa"
import * as path from "path"
import * as serve from "koa-static"
import * as koaSession from "koa-session"
import * as bodyParser from "koa-bodyparser"
import * as session from "./sessions"
import * as mongo from "./mongo"
import { router } from "./router";
import { errorHandler } from "./middleware"
import { Context } from "./types/app";
import { runMigrations } from "./migrations";
import { Organizations } from "./data-access/organizations"
import { Users } from "./data-access/users"
import { Reservations } from "./data-access/reservations"
import { Customers } from "./data-access/customers"
import { Reviews } from "./data-access/reviews"
import { Invitations } from "./data-access/invitations"

export async function createServer() {
  const app = new Koa<{}, Context>()
  const mongoClient = await mongo.createClient(config.MONGODB_URI)
  const mongoDatabase = mongo.getDatabase(mongoClient)

  await runMigrations(mongoDatabase)

  app.context.mongo = mongoDatabase
  app.context.organizations = new Organizations(mongoDatabase)
  app.context.users = new Users(mongoDatabase)
  app.context.reservations = new Reservations(mongoDatabase)
  app.context.customers = new Customers(mongoDatabase)
  app.context.reviews = new Reviews(mongoDatabase)
  app.context.invitations = new Invitations(mongoDatabase)
  app.keys = config.APP_KEYS.split(";")
  app.use(errorHandler)
  app.use(bodyParser())
  // @ts-ignore
  app.use(koaSession(session.getSessionConfig(mongoDatabase), app))
  app.use(serve(path.join(__dirname, "../public")))
  app.use(router.routes());
  app.listen(config.PORT, () => console.log(`app is listening PORT ${config.PORT}`))

  return {
    async dispose() {
      await mongo.closeClient(mongoClient)
    }
  }
}

/** If process won't exit in 5s second after determination signal, force exit */
function shutdown(signal: string) {
  return function (err: Error) {
    console.log(`Received ${signal} signal...`);

    if (err) {
      console.error(err.stack || err);
    }

    setTimeout(function () {
      console.log('...waited 5s, exiting.');
      process.exit(err ? 1 : 0);
    }, 5000).unref()
  }
}

if (!module.parent) {
  createServer()
    .then(server => {
      const dispose = (err: Error) => server.dispose().then(() => process.exit(err ? 1 : 0))

      process.on("SIGHUP", dispose)
      process.on("SIGHUP", shutdown("SIGHUP"))
      process.on("SIGTERM", dispose)
      process.on("SIGTERM", shutdown("SIGTERM"))
    })
    .catch(err => console.error(err))
}
