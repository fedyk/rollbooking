/**
 * Convert object to dotted-key/value pair
 */
const SEPARATOR = ".";
const KEEP_ARRAY = false;

export function toDottedObject(obj: any, target = {}, path = []) {
  const keys = Object.keys(obj);

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];

    if (
      (
        isArrayOrObject(obj[key]) &&
        (
          (isObject(obj[key]) && !isEmptyObject(obj[key])) ||
          (Array.isArray(obj[key]) && (!KEEP_ARRAY && (obj[key].length !== 0)))
        )
      )
    ) {
      toDottedObject(obj[key], target, path.concat(key))
    } else {
      target[path.concat(key).join(SEPARATOR)] = obj[key]
    }
  }

  return target
}

function isArrayOrObject (val) {
  return Object(val) === val
}

function isObject (val) {
  return Object.prototype.toString.call(val) === '[object Object]'
}

function isEmptyObject (val) {
  return Object.keys(val).length === 0
}
