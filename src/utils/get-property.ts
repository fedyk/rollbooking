export function getProperty(properties: object, ns: string, property: string, defaultValue = null) {
  return properties &&
    properties[ns] &&
    properties[ns][property] ||
    defaultValue;
}