import { escape } from "../../helpers/html";
import { input } from "../../helpers/form";

interface Props {
  salonName: string;
  bookingDate: string;
  bookingMasterName: string;
  bookingServiceName: string;
}

export function checkout(props: Props) {
  return `<nav class="site-header py-1 mb-3">
    <div class="container d-flex flex-column flex-md-row justify-content-between">
      <a class="py-2 d-inline-block" href="">${escape(props.salonName)}</a>
    </div>
  </nav>

  <div class="container">
    <form method="post" action="">
      <div class="card mb-3">
        <div class="card-body">
          <div class="form-group">
            <label for="booking-date">Date</label>
            ${input("d", props.bookingDate, {
              readonly: true,
              "class": "form-control-plaintext",
              "id": "booking-date"
            })}
          </div>

          <div class="form-group">
            <label for="booking-master">Master</label>
            ${input("d", props.bookingMasterName, {
              readonly: true,
              "class": "form-control-plaintext",
              "id": "booking-master"
            })}
          </div>

          <div class="form-group">
            <label for="booking-master">Service</label>
            ${input("d", props.bookingServiceName, {
              readonly: true,
              "class": "form-control-plaintext",
              "id": "booking-master"
            })}
          </div>
        </div>
      </div>

      <div class="card mb-3">
        <div class="card-body">
          <div class="form-group">
            <label for="booking-date">Name</label>
            ${input("full_name", "", {
              "class": "form-control",
              "id": "booking-date",
              "required": true
            })}
          </div>

          <div class="form-group">
            <label for="booking-master">Email</label>
            ${input("email", "", {
              "type": "email",
              "class": "form-control",
              "id": "booking-master",
              "required": true
            })}
          </div>

          <button type="submit" class="btn btn-primary">Book</button>
        </div>
      </div>
    </form>
  </div>`
}
