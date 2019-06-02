import { ObjectID } from "bson";
import { ReservationURLParams } from "../interfaces";
import { Salon } from "../../../types/salon";
import { ReservationsCollection } from "../../../adapters/mongodb";
import { Reservation } from "../../../types/reservation";
import { escape } from "../../../helpers/html";

interface Props {
  salon: Salon
  reservation: Reservation;
}

var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

export const reservationView = ({ salon, reservation }: Props) => `
<div class="p-3 bg-white border-bottom">
  <h6>${escape(salon.name)}</h6>

  <div>
    <div class="float-left mr-3">
      <h5 class="mb-0">${reservation.start.day}</h5>
      <small class="text-secondary">${MONTHS[reservation.start.month]}</small>
    </div>

    <div>
      <h6 class="mb-0">Service Name</h6>
      <p class="text-secondary">${JSON.stringify(reservation.start)}</p>
    </div>
  </div>
</div>

`
