import * as http from "http";
import * as Koa from "koa";
import * as Router from "koa-router";
import * as bodyParser from "koa-bodyparser"
import * as request from "supertest";
import { router as calendarRouter } from "./router";
import { Salon } from "../../models/salon";
import { createTestSalon } from "../../tasks/salon/create-test-salon";
import { deleteTestSalon } from "../../tasks/salon/delete-test-salon";
import { Reservation } from "../../models/reservation";
import { createTestReservation } from "../../tasks/salon/create-test-reservation";
import { closeClient } from "../../adapters/mongodb";

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
    closeClient();
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

  describe("/events/create", function() {
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
  })

  describe("/events/update", function () {
    let reservation: Reservation = null;

    beforeEach(async function () {
      reservation = await createTestReservation({
        salonId: salon._id,
        masterId: salon.employees.users[0].id
      })
    })

    it("should update reservation start and end dates", function (done) {
      const app = new Koa();
      const router = new Router();
      const id = reservation._id.toHexString();
      const start = "2018-01-01T10:00:00";
      const end = "2018-01-01T11:00:00";

      router.use(salonMiddleware, calendarRouter.routes());

      request(http.createServer(app.use(bodyParser()).use(router.routes()).callback()))
        .post("/events/update")
        .send({ id, start, end })
        .set('Accept', 'application/json')
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          expect(res.body).toMatchObject({ id, start,  end })
          done();
        });
    })
    
    it("should update reservation masterId", function (done) {
      const app = new Koa();
      const router = new Router();
      const id = reservation._id.toHexString();
      const masterId = salon.employees.users[1].id.toHexString();

      router.use(salonMiddleware, calendarRouter.routes());

      request(http.createServer(app.use(bodyParser()).use(router.routes()).callback()))
        .post("/events/update")
        .send({ id, masterId })
        .set('Accept', 'application/json')
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          expect(res.body).toMatchObject({ id, masterId })
          done();
        });
    })
    
    it("should update reservation masterId", function (done) {
      const app = new Koa();
      const router = new Router();
      const id = reservation._id.toHexString();
      const serviceId = salon.services.items.filter(v => v.id !== reservation.serviceId)[0].id;

      router.use(salonMiddleware, calendarRouter.routes());

      request(http.createServer(app.use(bodyParser()).use(router.routes()).callback()))
        .post("/events/update")
        .send({ id, serviceId })
        .set('Accept', 'application/json')
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          expect(res.body).toMatchObject({ id, serviceId })
          done();
        });
    })
  })

  // it("should works: /events/list", function (done) {
  // })

  // it("should works: /events/update", function (done) {
  // })
  // it("should works: /events/delete", function (done) {
  // })

});