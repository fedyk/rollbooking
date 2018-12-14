import { select, SelectOption } from "../../helpers/form";
import { stringMapJoin } from "../../helpers/string-map-join";
import { attrs } from "../../helpers/html";

interface Props {
  salonName: string;
  dateOptions: SelectOption[];
  selectedDate: string;
  
  mastersOptions: SelectOption[];
  selectedMaster: string;

  servicesOptions: SelectOption[];
  selectedService: string;

  results: Array<{
    name: string;
    price: string;
    description?: string;
    times: Array<{
      url: string;
      text: string;
    }>
  }>

}

export const welcome = (props: Props) => `
<nav class="site-header py-1 mb-3">
  <div class="container d-flex flex-column flex-md-row justify-content-between">
    <a class="py-2 d-inline-block" href="#">${props.salonName}</a>
  </div>
</nav>
<div class="container">
  <div class="card mb-3">
    <div class="card-body">

      <div class="form-group">
        <label for="date">Select day</label>
        ${select("date", props.dateOptions, props.selectedDate, {
          "id": "date",
          "class": "custom-select"
        })}
      </div>

      <div class="form-group">
        <label for="master_id">Select Master</label>
        ${select("master_id", props.mastersOptions, props.selectedMaster, {
          "id": "master_id",
          "class": "custom-select"
        })}
      </div>

      <div class="form-group">
        <label for="service_id">Select day</label>
        ${select("master_id", props.servicesOptions, props.selectedService, {
          "id": "service_id",
          "class": "custom-select"
        })}
      </div>

    </div>
  </div>

  <div class="list-group">
    ${stringMapJoin(props.results, (item) => `
      <div class="list-group-item list-group-item-action flex-column align-items-start">
        <div class="d-flex w-100 justify-content-between">
          <h6 class="mb-1">${item.name}</h6>
          <small>${item.price}</small>
        </div>
        ${item.description && `<p class="mb-1">${item.description}</p>`}
        ${stringMapJoin(item.times, (time) => ` <a ${attrs({ href: time.url })} class="btn btn-primary btn-sm">${time.text}</a> `)}
      </div>
    `)}
  </div>
</div>
`
