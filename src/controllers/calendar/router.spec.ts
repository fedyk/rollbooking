import * as http from "http";
import * as Koa from "koa";
import * as Router from "koa-router";
import * as bodyParser from "koa-bodyparser"
import * as request from "supertest";
import { router as calendarRouter } from "./router";
import { Salon } from "../../models/salon";
import { createTestSalon } from "../../tasks/salon/create-test-salon";
import { deleteTestSalon } from "../../tasks/salon/delete-test-salon";

describe("calendar", function () {
  let salon: Salon = null;
  let salonMiddleware = (ctx, next) => {
    return ctx.state.salon = salon, next()
  }

  beforeAll(async function () {
    salon = await createTestSalon()
  })

  afterAll(async function () {
    await deleteTestSalon(salon._id.toHexString());
  })

  it("should return calendar html", function (done) {
    const app = new Koa();
    const router = new Router();
    router.use(salonMiddleware, calendarRouter.routes());

    request(http.createServer(app.use(router.routes()).callback()))
      .get("/")
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        expect(res.text).toContain("<!doctype html>")
        done();
      });
  })

  it("should create a simple reservation", function (done) {
    const app = new Koa();
    const router = new Router();
    const masterId = salon.employees.users[0].id.toHexString();
    const start = "2018-01-01T10:00:00";
    const end = "2018-01-01T11:00:00";

    router.use(salonMiddleware, calendarRouter.routes());

    request(http.createServer(app.use(bodyParser()).use(router.routes()).callback()))
      .post("/events/create")
      .send({ masterId, start, end })
      .set('Accept', 'application/json')
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        expect(res.body).toMatchObject({ start, end, masterId })
        done();
      });
  })

  // it("should works: /events/list", function (done) {
  // })

  // it("should works: /events/update", function (done) {
  // })
  // it("should works: /events/delete", function (done) {
  // })

});