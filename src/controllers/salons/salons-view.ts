import { Salon } from "../../models/salon";
import { stringMapJoin } from "../../helpers/string-map-join";
import { attrs } from "../../helpers/html";

interface Props {
  salons: Salon[]
}

export function salonsView(props: Props) {
  return `
    <h3>Salons</h3>
    <table class="table">
      <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Timezone</th>
          <th scope="col">Amount of masters</th>
          <th scope="col"></th>
        </tr>
      </thead>
      <tbody>
        ${stringMapJoin(props.salons, (salon) => `<tr>
          <td>
            ${salon.name}
            <br/>
            <small class="text-secondary">id: ${salon._id.toHexString()}</small>
          </td>
          <td>${salon.timezone}</td>
          <td>${salon.employees.users.length}</td>
          <td>
            <a class="badge badge-light" ${attrs({ href: `/${salon.alias}/booking` })}>Booking</a>
            <a class="badge badge-light" ${attrs({ href: `/${salon.alias}/calendar` })}>Calendar</a>
          </td>
        </tr>`)}
      </tbody>
    </table>
  `
}
