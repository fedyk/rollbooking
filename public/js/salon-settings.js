'use strict';

var salonSettings = (function() {

  /**
   * @param {HTMLFormElement} form 
   * @param {Event} event
   */
  function createService(form, event) {
    var isFormValid = validateServiceForm();

    if (!isFormValid && event) {
      event.preventDefault();
    }
  }

  /**
   * Check if service form is valid
   * @returns {boolean}
   */
  function validateServiceForm() {
    var form = document.querySelector('#service-form');

    if (!form) {
      return;
    }

    var submitButton = form.querySelector('button[type=submit]');

    if (!submitButton) {
      return;
    }

    var name = form.name && form.name.value.trim();

    if (!name || name.length === 0 || name.length > 512) {
      return !(submitButton.disabled = true); // end of validation
    }

    var price = form.price && form.price && parseFloat(form.price.value);

    if (price == null || isNaN(price)) {
      return !(submitButton.disabled = true);
    }

    // everything is ok
    return !(submitButton.disabled = false);
  }

  return {
    createService: createService,
    validateServiceForm: validateServiceForm,
  }
})()
