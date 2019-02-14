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
import { Client } from "../../models/client";
import { createTestClient } from "../../tasks/salon/create-test-client";

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
    let client: Client = null;

    beforeEach(async function () {
      reservation = await createTestReservation({
        salonId: salon._id,
        masterId: salon.employees.users[0].id
      });
    })

    beforeAll(async function() {
      client = await createTestClient({ salonId: salon._id });
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
    
    it("should update reservation clientId", function (done) {
      const app = new Koa();
      const router = new Router();
      const id = reservation._id.toHexString();
      const clientId = client._id.toHexString();
      const clientName = client.name;

      router.use(salonMiddleware, calendarRouter.routes());

      request(http.createServer(app.use(bodyParser()).use(router.routes()).callback()))
        .post("/events/update")
        .send({ id, clientId })
        .set('Accept', 'application/json')
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          expect(res.body).toMatchObject({ id, clientId, clientName })
          done();
        });
    })
  })

  describe("/events/list", function () {
    let reservation: Reservation;

    beforeAll(async function() {
      reservation = await createTestReservation({
        salonId: salon._id,
        masterId: salon.employees.users[0].id,
        date: new Date(2017, 0, 1)
      })
    })

    it("should return list of events", function(done) {
      const app = new Koa();
      const router = new Router();

      router.use(salonMiddleware, calendarRouter.routes());

      request(http.createServer(app.use(bodyParser()).use(router.routes()).callback()))
        .post("/events/list?date=2017-01-01")
        .set('Accept', 'application/json')
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          expect(res.body).toMatchObject([{
            id: reservation._id.toHexString(),
            masterId: reservation.masterId.toHexString(),
            start: "2017-01-01T10:00:00",
            end: "2017-01-01T11:00:00"
          }])
          done();
        });
    })
  })

  describe("/events/delete", function () {
    let reservation: Reservation;

    beforeAll(async function () {
      reservation = await createTestReservation({
        salonId: salon._id,
        masterId: salon.employees.users[0].id
      })
    })

    it("should delete event", function (done) {
      const app = new Koa();
      const router = new Router();

      router.use(salonMiddleware, calendarRouter.routes());

      request(http.createServer(app.use(bodyParser()).use(router.routes()).callback()))
        .post(`/events/delete?rid=${reservation._id.toHexString()}`)
        .set('Accept', 'application/json')
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          expect(res.text).toBe("ok");
          done();
        });
    })
  })
});