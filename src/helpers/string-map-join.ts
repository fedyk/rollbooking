/**
 * - in [1, 2], v => `${v} `
 * - out "1 2 "
 */
export function stringMapJoin<T>(items: T[], render: (item: T, i?: number) => string): string {
  let result = "";
  const len = items.length;

  for (let i = 0; i < len; i++) {
    result += render(items[i], i);
  }

  return result;
}

export const $$ = stringMapJoin;