export function indexBy<K, T>(items: T[], key: keyof T): Map<K, T> {
  const map = new Map<any, T>();

  for (let i = 0; i < items.length; i++) {
    const item = items[i];

    map.set(item[key], item);
  }

  return map;
}
