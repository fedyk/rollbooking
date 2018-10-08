'use strict';

var salonSettings = (function() {

  /**
   * 
   * @param {HTMLFormElement} form 
   * @param {Event} event
   */
  function createService(form, event) {
    var service = {
      name: form.name.value,
    }

    
  }

  function validateServiceForm() {
    var form = document.querySelector('#service-form');

    if (!form) {
      return;
    }

    
  }

  return {
    createService: createService,
    validateServiceForm: validateServiceForm,
  }
})()
