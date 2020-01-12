import * as http from "http";
import * as Koa from "koa";
import * as session from "koa-session";
import * as request from "supertest";
import { config } from "./session";
import { closeClient } from "../core/db/mongodb";

describe("session", function () {
  let cookie;

  afterAll(async function() {
    await closeClient();
  })

  it("should save value in session", function(done) {
    const app = new Koa();

    app.keys = ["test", "keys"];
    app.use(session(config, app)).use(ctx => {
      let n = ctx.session.views || 0;
      ctx.session.views = ++n;
      ctx.body = n + ' views';
    });

    request(http.createServer(app.callback()))
      .get("/")
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        [cookie] = res.header["set-cookie"];
        expect(res.text).toContain("1 views");
        done();
      });
  })
  
  it("should save state between requests", function(done) {
    const app = new Koa();

    app.keys = ["test", "keys"];
    app.use(session(config, app)).use(ctx => {
      let n = ctx.session.views || 0;
      ctx.session.views = ++n;
      ctx.body = n + ' views';
    });

    request(http.createServer(app.callback()))
      .get("/")
      .set("cookie", cookie)
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        expect(res.text).toContain("2 views");
        done();
      });
  })
});