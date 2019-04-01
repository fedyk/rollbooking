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
<form method="post" action="">
  <div class="p-3 bg-white border-bottom mb-3">
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

  ${!props.isAuthenticated ? `
  <div class="p-3 bg-white border-bottom mb-3">
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
  </div>`:
  `<div class="list-group mb-3">
    <div class="list-group-item border-right-0 border-left-0 rounded-0">
      <h6 class="mb-0">Account</h6>
    </div>

    <a href="#" class="list-group-item border-right-0 border-left-0 rounded-0">
      <h6 class="mb-0 text-body">${escape(props.userName)}</h6>
      <small class="text-muted">${escape(props.userEmail)}</small>
    </a>
  </div>`}

  <div class="pl-3 pr-3">
    <button type="submit" class="btn btn-block btn-primary">Book</button>
  </div>
</form>
`
