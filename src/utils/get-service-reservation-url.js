const { URLSearchParams } = require('url');

module.exports = function getServiceReservationUrl(serviceId, salonId, masterId, time) {
  const params = new URLSearchParams({
    s: serviceId != null ? serviceId : '',
    m: masterId != null ? masterId : '',
    t: (time instanceof Date) ? time.toISOString() : (time + '')
  })

  return `/widgets/reservation/${salonId}/confirm?${params.toString()}` 
}
