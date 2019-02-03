export function assert(expression: any, message: string) {
  if (!expression) {
    throw new Error(message);
  }
}
