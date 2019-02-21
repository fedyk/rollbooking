import { stringMapJoin } from "../../helpers/string-map-join";
import { DateTime } from "../../models/date-time";
import { dateTimeToISODate } from "../../helpers/date/date-time-to-iso-date";
import { escape } from "../../helpers/html";

interface Props {
  userName: string;
  email: string;
  reservations: Array<{
    id: string;
    salonName: string;
    masterName: string;
    serviceName: string;
    servicePrice: string;
    start: DateTime;
    end: DateTime;
  }>
}

export const profileView = (props: Props) => `
<h4 class="mb-0">${escape(props.userName)}</h4>
<p class="mb-3 text-muted">${escape(props.email)}</p>

${props.reservations.length > 0 ? `
<ul class="list-group mb-3">
  ${stringMapJoin(props.reservations, ({ salonName, serviceName, start, end, masterName, servicePrice }) => `
  <li class="list-group-item d-flex justify-content-between lh-condensed">
    <div>
      <h6 class="my-0">${escape(serviceName)}</h6>
      <small class="text-muted">${dateTimeToISODate(start)} - ${dateTimeToISODate(end)} · ${escape(salonName)} ·  ${escape(masterName)}</small>
    </div>
    <span class="text-muted">${escape(servicePrice)}</span>
  </li>
`)}
</ul>
` : ``}
`;
