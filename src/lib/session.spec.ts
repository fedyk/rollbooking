import * as http from "http";
import * as Koa from "koa";
import * as session from "koa-session";
import * as request from "supertest";
import { config } from "./session";

describe("session", function () {
  let app: Koa;
  let server: http.Server;
  let cookie;

  beforeAll(async function () {
    app = new Koa();
    app.keys = ["test", "keys"];
    app.use(session(config, app)).use(ctx => {
      let n = ctx.session.views || 0;
      ctx.session.views = ++n;
      ctx.body = n + ' views';
    });
    server = http.createServer(app.callback())
  })

  it("should save value in session", function(done) {
    request(server)
      .get("/")
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        cookie = res.header["set-cookie"];
        expect(res.text).toContain("1 views");
        done();
      });
  })
  
  it("should save state between requests", function(done) {
    request(server)
      .get("/")
      .set("Cookie", cookie)
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        expect(res.text).toContain("2 views");
        done();
      });
  })
});