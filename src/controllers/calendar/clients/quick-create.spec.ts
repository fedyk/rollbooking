
import * as http from "http";
import * as Koa from "koa";
import * as Router from "koa-router";
import * as bodyParser from "koa-bodyparser"
import * as request from "supertest";
import { Salon } from "../../../models/salon";
import { createTestSalon } from "../../../tasks/salon/create-test-salon";
import { deleteTestSalon } from "../../../tasks/salon/delete-test-salon";
import { closeClient } from "../../../adapters/mongodb";
import { quickCreate } from "./quick-create";

describe("quick Create", function () {
  let salon: Salon = null;
  let salonMiddleware = (ctx, next) => {
    return ctx.state.salon = salon, next()
  }

  beforeAll(async function () {
    salon = await createTestSalon();
  })

  afterAll(async function () {
    await deleteTestSalon(salon._id.toHexString());
    await closeClient();
  })

  it("do not create client", function (done) {
    const app = new Koa();
    const router = new Router<any, Koa.Context>();
    const text = "";

    router.use(bodyParser()).use(salonMiddleware).post("/", quickCreate);

    request(http.createServer(app.use(router.routes()).callback()))
      .post("/")
      .send({ text })
      .expect(400)
      .end(function (err, res) {
        if (err) return done(err);
        done();
      });
  })
  
  it("create client with name", function (done) {
    const app = new Koa();
    const router = new Router<any, Koa.Context>();
    const text = "Test Client";

    router.use(bodyParser()).use(salonMiddleware).post("/", quickCreate);

    request(http.createServer(app.use(router.routes()).callback()))
      .post("/")
      .send({ text })
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        expect(res.body).toMatchObject({
          name: text,
          email: "",
          phone: ""
        })
        done();
      });
  })

  it("create client with name", function (done) {
    const app = new Koa();
    const router = new Router<any, Koa.Context>();
    const text = "test@example.com";

    router.use(bodyParser()).use(salonMiddleware).post("/", quickCreate);

    request(http.createServer(app.use(router.routes()).callback()))
      .post("/")
      .send({ text })
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        expect(res.body).toMatchObject({
          name: "Client",
          email: text,
          phone: ""
        })
        done();
      });
  })
})
