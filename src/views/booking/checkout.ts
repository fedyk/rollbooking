import { escape } from "../../helpers/html";

interface Props {
  salonName: string;
  masterId: string;
  serviceId: string;
  date: string;
}

export function checkout(props: Props) {
  return `<nav class="site-header py-1 mb-3">
    <div class="container d-flex flex-column flex-md-row justify-content-between">
      <a class="py-2 d-inline-block" href="#">${escape(props.salonName)}</a>
    </div>
  </nav>
  <div class="container">
    <div class="card mb-3">
      <div class="card-body">
        <p>Reserve a visit to barber</p>
        <p>Master ${escape(props.masterId)}</p>
        <p>Service ${escape(props.serviceId)}</p>
        <p>Date ${escape(props.date)}</p>
      </div>
    </div>
  </div>`
}
