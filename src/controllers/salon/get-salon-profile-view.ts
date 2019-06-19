import { Salon, BusinessHours } from '../../types/salon';
import { escape } from '../../helpers/html';
import { stringMapJoin } from '../../helpers/string-map-join';
import { indexPeriodsByOpenDay } from '../../helpers/booking/index-periods-by-open-day';
import { DayOfWeek } from '../../types/dat-of-week';
import { timeOfDayToISOTime } from '../../helpers/date/time-of-day-to-iso-time';

interface Props {
  salon: Salon
}

export function getSalonProfileView(props: Props) {
  return /*html*/`<div class="card border-0 shadow-sm mb-3">
    <div class="card-body">
      <h6 class="mb-0">${escape(props.salon.name)}</h6>
      <div class="text-muted">Barbershop</div>
    </div>
  </div>

  <div class="card border-0 shadow-sm mb-3">
    <div class="card-header bg-transparent">Information</div>
    <div class="card-body">
      ${props.salon.description ? `<p class="card-text">${escape(props.salon.description)}</p>` : ``}
      <p class="card-text">${getSalonOpenHours(props.salon.regularHours)}</p>
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
          <div>${escape(service.description)}</div>
        </div>
      `)}
    </div>
  </div>
  `
}

function getSalonOpenHours(regularHours: BusinessHours): string {
  const periodsByOpenDay = indexPeriodsByOpenDay(regularHours.periods).entries();

  return `<table class="table table-borderless">
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
