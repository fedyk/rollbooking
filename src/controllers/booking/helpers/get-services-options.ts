import { SelectOption } from "../../../helpers/form";
import { SalonService } from "../../../models/salon-service";
import { getServiceName } from "../../../utils/service";

export function getServiceOptions(salonServices: SalonService[]): SelectOption[] {
  const options: SelectOption[] = [];

  salonServices.forEach(salonService => {
    options.push({
      value: `${salonService.id}`,
      disabled: false,
      text: getServiceName(salonService)
    })
  });
  
  return options;
}
