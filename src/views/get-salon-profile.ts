import { Salon, BusinessHours } from '../base/types/salon';
import { escape } from '../helpers/html';
import { stringMapJoin } from '../helpers/string-map-join';
import { indexPeriodsByOpenDay } from '../helpers/booking/index-periods-by-open-day';
import { DayOfWeek } from '../base/types/dat-of-week';
import { timeOfDayToISOTime } from '../helpers/date/time-of-day-to-iso-time';

interface Props {
  salon: Salon
}

export function getSalonProfileView(props: Props) {
  return /*html*/`<div class="card border-0 shadow-sm mb-3">
    <div class="card-body">
      <div class="d-flex justify-content-between align-items-center">
        <div>
          <h6 class="mb-0">${escape(props.salon.name)}</h6>
          <div class="text-muted">Barbershop</div>
        </div>
        <a class="btn btn-primary" href="/s/${props.salon.alias}/book">Book a Visit</a>
      </div>
    </div>
  </div>

  <div class="card border-0 shadow-sm mb-3">
    <div class="card-header bg-transparent">Information</div>
    <div class="card-body">
      ${props.salon.description ? /*html*/`<p class="card-text">${escape(props.salon.description)}</p>` : ``}
      <div class="card-text">${getSalonOpenHours(props.salon.regularHours)}</div>
    </div>
  </div>

  <div class="card border-0 shadow-sm mb-3">
    <div class="card-header bg-transparent">Services</div>
    <div class="card-body pb-2">
      ${stringMapJoin(props.salon.services.items, (service) => /*html*/`
        <div class="mb-2">
          <div class="d-flex w-100 justify-content-between">
            <h6 class="mb-1">List group item heading</h6>
            <h6>${service.price}</h6>
          </div>
          ${service.description && /*html*/`<div>${escape(service.description)}</div>`}
        </div>
      `)}
    </div>
  </div>
  `
}

function getSalonOpenHours(regularHours: BusinessHours): string {
  const periodsByOpenDay = indexPeriodsByOpenDay(regularHours.periods).entries();

  return `<table class="table table-borderless mb-0">
    <tbody>
      ${stringMapJoin(periodsByOpenDay, ([dayOfWeek, periods]) => `
        <tr>
          <td class="pl-0 pt-0">${ DayOfWeek[dayOfWeek] }</td>
          <td class="pl-0 pt-0">${ stringMapJoin(periods, period => timeOfDayToISOTime(period.openTime) + ' - ' + timeOfDayToISOTime(period.closeTime)) }</td>
        </tr>
      `)}
    </tbody>
  </table>`
}
