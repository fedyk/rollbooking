
import * as http from "http";
import * as Koa from "koa";
import * as Router from "koa-router";
import * as bodyParser from "koa-bodyparser"
import * as request from "supertest";
import { Salon } from "../../../types/salon";
import { createTestSalon } from "../../../tasks/salon/create-test-salon";
import { deleteTestSalon } from "../../../tasks/salon/delete-test-salon";
import { closeClient } from "../../../adapters/mongodb";
import { suggest } from "./suggest";
import { Client } from "../../../types/client";
import { createTestClient } from "../../../tasks/salon/create-test-client";
import { deleteTestClient } from "../../../tasks/salon/delete-test-client";

describe("suggest", function () {
  let salon: Salon = null;
  let client: Client = null;
  let salonMiddleware = (ctx, next) => {
    return ctx.state.salon = salon, next()
  }

  beforeAll(async function () {
    salon = await createTestSalon();
    client = await createTestClient({
      salonId: salon._id,
      name: "Test Client",
      email: "email@example.com",
      phone: "666666666"
    });
  })

  afterAll(async function () {
    await deleteTestSalon(salon._id.toHexString());
    await deleteTestClient(client._id);
    await closeClient();
  })

  it("return empty response", function (done) {
    const app = new Koa();
    const router = new Router<any, Koa.Context>();
    router.use(salonMiddleware).post("/", suggest);

    request(http.createServer(app.use(router.routes()).callback()))
      .post("/")
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        expect(res.body).toEqual([])
        done();
      });
  })
  
  it("return find one client by name", function (done) {
    const app = new Koa();
    const router = new Router<any, Koa.Context>();
    router.use(salonMiddleware).post("/", suggest);

    request(http.createServer(app.use(router.routes()).callback()))
      .post(`/?q=${escape(client.name.slice(0, 4))}`)
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        expect(res.body).toMatchObject([{
          id: client._id.toHexString(),
          name: client.name
        }])
        done();
      });
  })
  
  it("return find one client by email", function (done) {
    const app = new Koa();
    const router = new Router<any, Koa.Context>();
    router.use(salonMiddleware).post("/", suggest);

    request(http.createServer(app.use(router.routes()).callback()))
      .post(`/?q=${client.email.slice(0, 3)}`)
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        expect(res.body).toMatchObject([{
          id: client._id.toHexString(),
          email: client.email
        }])
        done();
      });
  })
  
  it("return find one client by phone", function (done) {
    const app = new Koa();
    const router = new Router<any, Koa.Context>();
    router.use(salonMiddleware).post("/", suggest);

    request(http.createServer(app.use(router.routes()).callback()))
      .post(`/?q=${client.phone.slice(0, 3)}`)
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        expect(res.body).toMatchObject([{
          id: client._id.toHexString(),
          phone: client.phone
        }])
        done();
      });
  })
});