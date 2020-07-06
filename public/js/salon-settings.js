'use strict';

var salonSettings = (function() {

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

  /**
   * 
   * @param {number} salonId
   * @param {number} serviceId
   */
  function deleteService(salonId, serviceId) {

    /**
     * @type {HTMLLIElement}
     */
    var listElement = document.querySelector("[data-service-list-item=\"" + serviceId + "\"]");

    if (listElement) {
      // Remove separator
      if (listElement.nextElementSibling && listElement.nextElementSibling.getAttribute('role') === 'separator') {
        listElement.parentElement.removeChild(listElement.nextElementSibling);
      }

      listElement.parentElement.removeChild(listElement);
      listElement = null;
    }

    fetch("/salon" + salonId + "/settings/services/" + serviceId + "/delete", {
      method: "DELETE"
    }).then(function() {}).catch(function() {});
  }

  return {
    deleteService: deleteService,
    validateServiceForm: validateServiceForm,
  }
})()
