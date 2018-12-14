import { stringMapJoin } from "./string-map-join";
import { attrs } from "./html";

export interface SelectOption {
  value?: string;
  disabled?: boolean;
  text: string;
}

export function select(name: string, options: SelectOption[], selected?: string, attributes?: {}) {
  attributes = Object.assign({}, attributes, {
    name: name
  });

  const optionsHTML = stringMapJoin(options, (option) => {
    const value = option.value || option.text;
    const isSelected = value === selected;
    const attributes = {
      value: value,
      selected: isSelected,
      disabled: !!option.disabled
    };

    return `<option ${attrs(attributes)}>${option.text}</option>`;
  });

  return `<select ${attrs(attributes)}>${optionsHTML}</select>`
}