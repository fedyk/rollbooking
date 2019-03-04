import { select, SelectOption } from "../../helpers/form";
import { stringMapJoin } from "../../helpers/string-map-join";
import { attrs } from "../../helpers/html";

interface Props {
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
<div class="card mb-3">
  <div class="card-body">
    <form method="get" action="">

      <div class="form-row">
        <div class="form-group col-sm-4 mb-sm-0">
          ${select("d", props.dateOptions, props.selectedDate, {
            "id": "date",
            "class": "custom-select",
            "onchange": "this.form.submit()"
          })}
        </div>

        ${props.mastersOptions.length > 0 ? 
        `<div class="form-group col-sm-4 mb-sm-0">
          ${select("mid", props.mastersOptions, props.selectedMaster, {
            "id": "master_id",
            "class": "custom-select",
            "onchange": "this.form.submit()"
          })}
        </div>` : ``}

        ${props.servicesOptions.length > 0 ? 
        `<div class="form-group col-sm-4 mb-sm-0">
          ${select("sid", props.servicesOptions, props.selectedService, {
            "id": "service_id",
            "class": "custom-select",
            "onchange": "this.form.submit()"
          })}
        </div>` : ``}
      </div>

    </form>
  </div>
</div>

${props.results.length === 0 ? `
  <div class="p-5 text-center">
    <div class="material-icons d-block mb-1" style="font-size: 42px;">access_time</div>
    <h6 class="mb-1">No results found</h6>
    <p class="mb-3 small">You can try another date or change master.</p>
    
    <div class="mb-3 mx-auto w-25 border-bottom"></div>

    <p class="mb-3 small">Subscribe to receive notification about new available terms.</p>

    <a ${attrs({ href: "" })} class="btn btn-outline-primary d-inline-flex align-items-center pl-3 pr-3">
      <i class="material-icons mr-2" style="font-size: 18px;">remove_red_eye</i>
      <span>Watch</span>
    </a>
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
