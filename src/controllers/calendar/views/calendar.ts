
import { stringMapJoin } from "../../../helpers/string-map-join";
import { attrs } from "../../../helpers/html";
import { Reservation } from "../../../models/reservation";
import { dateTimeToNativeDate } from "../../../helpers/date/date-time-to-native-date";
import { Date } from "../../../models/date";

interface Props {
  reservations: Reservation[];
  date: Date;
  resources: Array<{
    id: string;
    title: string;
  }>;
  events: Array<{
    id: string;
    title: string;
    start: string; // iso, local
    end: string; // iso, local
    resourceId: string;
  }>;
}

export const calendar = ({ reservations, date, resources, events }: Props) => `

<h5 class="h5 d-flex justify-content-between align-items-center">
  Calendar
  <button class="btn btn-sm btn-primary text-white"><i class="material-icons">event</i> New</button>
</h5>

<div id="calendar"></div>

  <h3>Calendar</h3>
  <table class="table">
    <thead>
      <tr>
        <th scope="col">Date</th>
        <th scope="col">User</th>
        <th scope="col">SalonId</th>
        <th scope="col">MasterId</th>
      </tr>
    </thead>
    <tbody>
      ${stringMapJoin(reservations, (reservation) => `<tr>
        <td>${dateTimeToNativeDate(reservation.start)} - ${dateTimeToNativeDate(reservation.start)}</td>
        <td>${reservation.userId}</td>
        <td>${reservation.salonId}</td>
        <td>${reservation.masterId}</td>
        <td>
          <a class="badge badge-light" ${attrs({ href: `/booking/${reservation.salonId}` })}>Booking</a>
        </td>
      </tr>`)}
    </tbody>
  </table>

  <script src="/packages/calendar/calendar.js"></script>
  <script>calendar.render('#calendar', ${JSON.stringify(date)}, ${JSON.stringify(resources)}, ${JSON.stringify(events)})</script>
`
