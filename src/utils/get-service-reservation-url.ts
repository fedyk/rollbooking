const { URLSearchParams } = require('url');

export function getServiceReservationUrl(
  serviceId: number,
  salonId: number,
  masterId: number,
  time: Date
): string {
  const params = new URLSearchParams({
    s: serviceId != null ? serviceId : '',
    m: masterId != null ? masterId : '',
    t: (time instanceof Date) ? time.toISOString() : (time + '')
  })

  return `/widgets/reservation/${salonId}/confirm?${params.toString()}` 
}
