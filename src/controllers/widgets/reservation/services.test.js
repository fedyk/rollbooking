const app = require('../../../app')
const supertest = require('supertest')
const SALON_ID = 1

describe('Widgets', () => {
  const server = app.listen()
  const request = supertest.agent(server)

  afterAll(function () {
    server.close();
  });

  describe(`GET /widgets/reservation/${SALON_ID}/services`, () => {
    it('should return 200 OK', () => {
      return request.post(`/widgets/reservation/${SALON_ID}/services`)
        .send({

        })
        .set('Accept', 'application/json')
        .expect('Content-Type', 'application/json')
        .expect(200)
    })
  });
})
