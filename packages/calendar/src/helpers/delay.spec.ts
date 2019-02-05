import { delay } from "./delay";

test("delay", async function() {
  const now = Date.now();
  const timeout = 100;

  await delay(timeout);

  expect(Date.now()).toBeGreaterThanOrEqual(now + timeout);
});
