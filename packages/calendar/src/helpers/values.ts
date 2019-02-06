export function values<T>(object: { [key: string]: T }): T[] {
  const result: T[] = [];

  for (var property in object) {
    if (object.hasOwnProperty(property)) {
      result.push(object[property]);
    }
  }

  return result;
}
