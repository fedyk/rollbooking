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
import { State, Context } from "./types/app";
import * as migrations from "./migrations";

export async function createServer() {
  const app = new Koa<State, Context>()
  const mongoClient = await mongo.createClient(config.MONGODB_URI)
  const mongoDatabase = mongo.getDatabase(mongoClient)

  await migrations.up(mongoDatabase)

  app.context.mongo = mongoDatabase
  app.keys = config.APP_KEYS.split(";")
  app.use(errorHandler)
  app.use(bodyParser())
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
function shutdown(signal) {
  return function (err) {
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
      const dispose = (err) => server.dispose().then(() => process.exit(err ? 1 : 0))

      process.on("SIGHUP", dispose)
      process.on("SIGHUP", shutdown("SIGHUP"))
      process.on("SIGTERM", dispose)
      process.on("SIGTERM", shutdown("SIGTERM"))
    })
    .catch(err => console.error(err))
}
