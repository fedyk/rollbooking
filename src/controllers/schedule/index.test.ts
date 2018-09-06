import { ok } from "assert";
import * as app from "../../app";
import * as supertest from "supertest";

const TEST_SALON_ID = process.env.TEST_SALON_ID || 1;
const TEST_MASTER_ID = process.env.TEST_MASTER_ID || 1;
const TEST_SERVICE_ID = process.env.TEST_SERVICE_ID || 1;

describe('Schedule > Welcome', () => {
  const server = app.listen()
  const request = supertest.agent(server)
  const url = `/schedule//${TEST_SALON_ID}`

  afterAll(function () {
    server.close();
  });

  describe(`POST ${url}`, () => {
    it('should return 200 OK', () => {
      return request.post(url).send({
        t: new Date,
        m: TEST_MASTER_ID,
        s: TEST_SERVICE_ID,
      })
      .expect(200)
      .then(response => ok(response.body))
    })
  })

})
