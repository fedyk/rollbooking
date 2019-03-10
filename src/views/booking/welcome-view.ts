import { select, SelectOption, input } from "../../helpers/form";
import { stringMapJoin } from "../../helpers/string-map-join";
import { attrs, classes } from "../../helpers/html";

interface Props {
  isAuthenticated: boolean;
  isSubscribed: boolean | null;

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

  subscribeUrl: string;
  unsubscribeUrl: string;
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
    
    ${props.isAuthenticated ? `
      <div class="mb-3 mx-auto w-25 border-bottom"></div>

      <p class="mb-3 small">Subscribe to receive notification about new available slots.</p>

      <div class="${classes({ "subscription-container": true, "is-subscribed": props.isSubscribed })}">
        <form ${attrs({
          action: props.subscribeUrl,
          method: "POST",
          "class": "subscribe-form"
        })}>
          ${input("action", "subscribe", { type: "hidden" })}
          ${input("date", props.selectedDate, { type: "hidden" })}
          ${input("serviceId", props.selectedService, { type: "hidden" })}
          ${input("userId", props.selectedMaster, { type: "hidden" })}
          <button class="btn btn-outline-primary d-inline-flex align-items-center pl-3 pr-3" type="subscribe">
            <i class="material-icons mr-2">remove_red_eye</i>
            <span>Subscribe</span>
          </button>
        </form>

        <form ${attrs({
          action: props.unsubscribeUrl,
          method: "POST",
          "class": "unsubscribe-form"
        })}>
          ${input("action", "unsubscribe", { type: "hidden" })}
          ${input("date", props.selectedDate, { type: "hidden" })}
          ${input("serviceId", props.selectedService, { type: "hidden" })}
          ${input("userId", props.selectedMaster, { type: "hidden" })}
          <button class="btn btn-outline-primary d-inline-flex align-items-center pl-3 pr-3" type="subscribe">
            <i class="material-icons mr-2">remove_red_eye</i>
            <span>Unsubscribe</span>
          </button>
        </form>
      </div>
    ` : ``}
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
