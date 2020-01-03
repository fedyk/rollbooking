import { SelectOption } from "../../../helpers/form";
import { SalonService } from "../../../base/types/salon";

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
