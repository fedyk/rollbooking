import { stringMapJoin } from "./string-map-join";
import { attrs } from "./html";

export function input(name: string, value: string, attributes = {}): string {
  const type = attributes && attributes["type"] || "text";

  attributes = Object.assign({}, attributes, {
    name: name,
    value: value,
    type: type
  })

  return `<input ${attrs(attributes)} />`
}

export function hidden(name: string, value: string, attributes = {}): string {
  return input(name, value, Object.assign(attributes, {
    type: "hidden"
  }))
}

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
    const value = option.value === undefined ? option.text : option.value;
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
