import SalonUser from "../../../models/salon-user";
import { SelectOption } from "../../../helpers/form";
import getUserName from "../../../utils/get-user-name";

export function getMastersOptions(salonUsers: SalonUser[]): SelectOption[] {
  const options: SelectOption[] = [{
    value: "",
    disabled: false,
    text: "Any Barber"
  }];

  salonUsers.forEach(salonUser => {
    options.push({
      value: `${salonUser.user_id}`,
      disabled: false,
      text: getUserName(salonUser)
    })
  });
  
  return options;
}
