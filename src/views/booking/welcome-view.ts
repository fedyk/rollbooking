import { select, SelectOption } from "../../helpers/form";
import { stringMapJoin } from "../../helpers/string-map-join";
import { attrs } from "../../helpers/html";

interface Props {
  showFilters: boolean;

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

export const welcomeView = (props: Props) => `
${props.showFilters ? `
<div class="card mb-3">
  <div class="card-body">
    <form method="get" action="">
      <div class="form-group">
        ${select("d", props.dateOptions, props.selectedDate, {
          "id": "date",
          "class": "custom-select",
          "onchange": "this.form.submit()"
        })}
      </div>

      <div class="form-group">
        ${select("m", props.mastersOptions, props.selectedMaster, {
          "id": "master_id",
          "class": "custom-select",
          "onchange": "this.form.submit()"
        })}
      </div>

      <div class="form-group">
        ${select("s", props.servicesOptions, props.selectedService, {
          "id": "service_id",
          "class": "custom-select",
          "onchange": "this.form.submit()"
        })}
      </div>
    </form>
  </div>
</div>
` : ``}

${props.results.length === 0 ? `
  <div class="p-5 text-center">
    <p class="text-muted">No available times 😕</p>
  </div>
` : ``}

${props.results.length > 0 ? `
<div class="list-group">
  ${stringMapJoin(props.results, (item) => `
    <div class="list-group-item list-group-item-action flex-column align-items-start">
      <div class="d-flex w-100 justify-content-between">
        <h6 class="mb-1">${item.name}</h6>
        <small>${item.price}</small>
      </div>
      ${item.description && `<p class="mb-1">${item.description}</p>` || ''}
      ${stringMapJoin(item.times, (time) =>
        ` <a ${attrs({ href: time.url })} class="btn btn-outline-primary btn-sm">${time.text}</a> `
      )}
    </div>
  `)}
</div>
` : ``}
`
