import { escape } from "../../helpers/html";
import { input } from "../../helpers/form";

interface Props {
  isAuthenticated: boolean;
  userEmail: string;
  userName: string;
  bookingDate: string;
  bookingMasterName: string;
  bookingServiceName: string;
}

export const checkoutView = (props: Props) => `
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

    ${!props.isAuthenticated ? `
    <div class="card mb-3">
      <div class="card-body">
        <div class="form-group">
          <label for="booking-date">Name</label>
          ${input("name", props.userName, {
            "class": "form-control",
            "id": "booking-date",
            "required": true
          })}
        </div>

        <div class="form-group">
          <label for="booking-master">Email</label>
          ${input("email", props.userEmail, {
            "type": "email",
            "class": "form-control",
            "id": "booking-master",
            "required": true
          })}
        </div>
      </div>
    </div>`:
    `<div class="list-group mb-3">
      <div class="list-group-item border-bottom-0 lh-condensed">
        <h6 class="mb-0">Account</h6>
      </div>

      <a href="/profile" target="blank" class="list-group-item border-top-0 lh-condensed">
        <h6 class="mb-0 text-body">${escape(props.userName)}</h6>
        <small class="text-muted">${escape(props.userEmail)}</small>
      </a>
    </div>`}

    <button type="submit" class="btn btn-block btn-primary">Book</button>
  </form>
</div>`
