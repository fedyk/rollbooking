import { Salon } from "../../models/salon";
import { stringMapJoin } from "../../helpers/string-map-join";
import { attrs } from "../../helpers/html";

interface Props {
  salons: Salon[]
}

export const salonsView = (props: Props) => `
  <h3>Salons</h3>

  <table class="table">
    <thead>
      <tr>
        <th scope="col">Name</th>
        <th scope="col">Timezone</th>
        <th scope="col"></th>
      </tr>
    </thead>
    <tbody>
      ${stringMapJoin(props.salons, (salon) => `<tr>
        <td>
          ${salon.name}
          <small class="text-secondary d-block">id: ${salon._id.toHexString()}</small>
          <small class="text-secondary d-block">masters: ${salon.employees.users.length}</small>
        </td>
        <td>${salon.timezone}</td>
        <td>
          <a class="btn btn-sm btn-light" ${attrs({ href: `/${salon.alias}/booking` })}>Booking</a>
          <a class="btn btn-sm btn-light" ${attrs({ href: `/${salon.alias}/calendar` })}>Calendar</a>
        </td>
      </tr>`)}
    </tbody>
  </table>
`
