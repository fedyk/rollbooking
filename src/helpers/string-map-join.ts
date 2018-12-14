export function stringMapJoin<T>(items: T[], render: (item: T, i?: number) => string): string {
  let result = "";
  const len = items.length;

  for (let i = 0; i < len; i++) {
    result += render(items[i], i);
  }

  return result;
}


stringMapJoin([1], function(param) {
  return "param" + param;
})