export function indexBy<T>(items: T[], key): { [key: string]: T } {
  const result = {};
  var key;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];

    result[item[key]] = item;
  }

  return result;
}
