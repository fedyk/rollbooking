const app = require('../src/app')
const supertest = require('supertest')


describe('Widgets', () => {
  const server = app.listen()
  const request = supertest.agent(server)

  afterAll(function () {
    server.close();
  });

  describe("GET /widgets/reservation/1", () => {
    it("should return 200 OK", () => {
      return request.get("/widgets/reservation/1")
        .expect('Content-Type', /text\/html/)
        .expect(200)
    })
  });

  describe("GET /widgets/reservation/1/confirm", () => {
    it("should return 200 OK", () => {
      return request.get("/widgets/reservation/1")
        .expect('Content-Type', /text\/html/)
        .expect(200)
    })
  });

  describe("GET /widgets/reservation/1/preview", () => {
    it("should return 200 OK", () => {
      return request.get("/widgets/reservation/1")
        .expect('Content-Type', /text\/html/)
        .expect(200)
    })
  })

})
