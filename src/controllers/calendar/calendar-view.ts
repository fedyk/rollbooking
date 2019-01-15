
import { stringMapJoin } from "../../helpers/string-map-join";
import { attrs } from "../../helpers/html";
import { Reservation } from "../../models/reservation";
import { dateTimeToNativeDate } from "../../helpers/date/date-time-to-native-date";

interface Props {
  reservations: Reservation[]
}

export function calendarView(props: Props) {
  return `
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
        ${stringMapJoin(props.reservations, (reservation) => `<tr>
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
    <script crossorigin src="https://unpkg.com/react@16/umd/react.production.min.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@16/umd/react-dom.production.min.js"></script>
    <script crossorigin src="/packages/calendar/index.js"></script>
    <script>ReactDOM.render(React.createElement(calendar.Calendar, { title: "Hello" }), document.getElementById('calendar'));</script>
  `
}
