import { SelectOption } from "../../../helpers/form";
import { SalonService } from "../../../models/salon";
import { getServiceName } from "../../../utils/service";

export function getServiceOptions(salonServices: SalonService[]): SelectOption[] {
  const options: SelectOption[] = [{
    value: "",
    disabled: false,
    text: "Any Service"
  }];

  salonServices.forEach(salonService => {
    options.push({
      value: `${salonService.id}`,
      disabled: false,
      text: salonService.name
    })
  });
  
  return options;
}
