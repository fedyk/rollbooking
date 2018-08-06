const assert = require('assert')
const getServiceReservationUrl = require('./get-service-reservation-url')

describe('lib > getServiceReservationUrl', () => {
  it('should work', () => {
    const time = new Date(2018, 2, 1, 9, 30, 45, 500);

    assert.equal(
      getServiceReservationUrl(1, 2, 3, time),
      `/widgets/reservation/2/confirm?s=1&m=3&t=2018-03-01T08%3A30%3A45.500Z`
    )
  })
})
