import * as tz from "timezone-support"

export type ZonedTime = ReturnType<typeof tz.getZonedTime>

export interface Slot {
  start: ZonedTime
  end: ZonedTime
  userId: string
  serviceId: string
}
