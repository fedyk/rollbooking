import { SelectOption } from "../../../helpers/form";
import { User } from "../../../types/user";

export function getMastersOptions(users: User[]): SelectOption[] {
  const options: SelectOption[] = [{
    value: "",
    disabled: false,
    text: "Any Barber"
  }];

  users.forEach(salonUser => {
    options.push({
      value: `${salonUser._id.toHexString()}`,
      disabled: false,
      text: salonUser.name
    })
  });
  
  return options;
}
