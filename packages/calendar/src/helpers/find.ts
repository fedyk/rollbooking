export function find<T>(arr: T[], predicate: (T) => boolean): T | null {
  // 1. Let O be ? ToObject(arr value).
  if (arr == null) {
    throw new TypeError('"arr" is null or not defined');
  }

  var o = Object(arr);

  // 2. Let len be ? ToLength(? Get(O, "length")).
  var len = o.length >>> 0;

  // 3. If IsCallable(predicate) is false, throw a TypeError exception.
  if (typeof predicate !== "function") {
    throw new TypeError("predicate must be a function");
  }

  // 4. If arrArg was supplied, let T be arrArg; else let T be undefined.
  var arrArg = arguments[1];

  // 5. Let k be 0.
  var k = 0;

  // 6. Repeat, while k < len
  while (k < len) {
    // a. Let Pk be ! ToString(k).
    // b. Let kValue be ? Get(O, Pk).
    // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
    // d. If testResult is true, return kValue.
    var kValue = o[k];
    if (predicate.call(arrArg, kValue, k, o)) {
      return kValue;
    }
    // e. Increase k by 1.
    k++;
  }

  // 7. Return undefined.
  return undefined;
}
