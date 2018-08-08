const assert = require('assert')
const app = require('../../../app')
const supertest = require('supertest')
const TEST_SALON_ID = process.env.TEST_SALON_ID || 1;

describe('Widgets / Reservation / getServices', () => {
  const server = app.listen()
  const request = supertest.agent(server)
  const url = `/widgets/reservation/${TEST_SALON_ID}/get-services`

  afterAll(function () {
    server.close();
  });


  it('should return 200 OK', () => {
    return request.post(`/widgets/reservation/${TEST_SALON_ID}/get-services`)
      .send({
        t: new Date
      })
      .set('Accept', 'application/json')
      // .expect('Content-Type', 'application/json')
      .expect(200)
      .then(response => {
        assert(response.body, 'test')
      })
  })
})
