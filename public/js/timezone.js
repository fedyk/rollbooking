/**
 * Find all inputs with class ".auto-detected-timezone" and set the user timezone' name
 */
document.addEventListener("DOMContentLoaded", function () {
  var tz = window.jstz ? window.jstz.determine() : void 0;
  var name = tz ? tz.name() : void 0;
  var inputs = document.getElementsByClassName("timezone-auto-detect")

  if (!name) {
    console.warn("[timezone] failed to auto-detect timezone")
  }

  for (var i = 0; i < inputs.length; i++) {
    const input = inputs[i]

    if (input instanceof HTMLInputElement) {
      input.value = name
    }
  }
})
