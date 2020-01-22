(function () {
  document.addEventListener("DOMContentLoaded", updateJoinFormTimezone)

  function updateJoinFormTimezone() {
    var determinedTimezone = window.jstz ? window.jstz.determine() : void 0;
    var timezoneName = determinedTimezone ? determinedTimezone.name() : void 0;
    /** @type {HTMLFontElement} */
    var joinForm;
    /** @type {HTMLInputElement} */
    var timezoneInput;

    if (!timezoneName) {
      throw new Error("Failed to detect timezone")
    }

    joinForm = document.getElementById("join-form")

    if (!joinForm) {
      throw new Error("Cannot find join-form element")
    }

    timezoneInput = joinForm.querySelector("input[name=timezone]")

    // create timezone input, if empty
    if (!timezoneInput) {
      timezoneInput = document.createElement("input")
      timezoneInput.type = "hidden"
      timezoneInput.name = "timezone"
      joinForm.appendChild(timezoneInput)
    }

    timezoneInput.value = timezoneName
  }
})()
