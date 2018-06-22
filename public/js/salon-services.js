'use strict';

var services = (function() {

/**
 * Main NS
 */
var services = {};

var MDCDialog = mdc.dialog.MDCDialog;
var MDCDialogUtil = mdc.dialog.util;
var MDCTextField = mdc.textField.MDCTextField;
var MDCSelect = mdc.select.MDCSelect;

/**
 * Salon Services List
 * @param {HTMLElement} root
 */
function SalonServices(root) {

  return {
    resetContent: resetContent
  }

  /**
   * Reset content
   * @param {string} html 
   * @return {SalonServices}
   */
  function resetContent(html) {
    return root.innerHTML = html;
  }
}


function salonServices() {
	return salonServices.$instance || (
    salonServices.$instance = new SalonServices(document.querySelector('#salon-services'))
  )
}

/**
 * Expose SalonServices as a singleton
 */
Object.defineProperty(services, 'salonServices', { get: salonServices });

/**
 * Services dialog
 * @param {HTMLDivElement} root
 */
function ServiceDialog(root) {
  var dialog = new MDCDialog(root);
  var dialogSurface = root.querySelector('.mdc-dialog__surface')

  var form = root.querySelector('form')

  var nameField = root.querySelector('#name-field');
  var nameFieldInput = root.querySelector('#name-field-input');
  var nameFieldMaterial = new MDCTextField(nameField);

  var durationField = root.querySelector('#duration-field');
  var durationFieldInput = root.querySelector('#duration-field-input');
  var durationFieldMaterial = new MDCSelect(durationField);
  
  var priceField = root.querySelector('#price-field');
  var priceFieldInput = root.querySelector('#price-field-input');
  var priceFieldMaterial = new MDCTextField(priceField);
  
  var descriptionField = root.querySelector('#description-field');
  var descriptionFieldInput = root.querySelector('#description-field-input');
  var descriptionFieldMaterial = new MDCTextField(descriptionField);

  var saveButton = root.querySelector('.mdc-dialog__footer__button--save');
  var deleteButton = root.querySelector('.mdc-dialog__footer__button--delete');

  dialog.focusTrap_.deactivate()
  dialog.focusTrap_ = MDCDialogUtil.createFocusTrapInstance(dialogSurface, nameFieldInput)

  return {
    createService: createService,
    editService: editService,
    saveService: saveService,
    deleteService: deleteService,
  }

  /**
   * @param {string} salonId
   * @return {Promise}
   */
  function createService(salonId) {
    form.action = '/schedule/' + salonId + '/services'
    form.setAttribute('data-method', 'POST')

    nameFieldMaterial.value = ''
    durationFieldMaterial.value = '45'
    priceFieldMaterial.value = '0'
    descriptionFieldMaterial.value = ''

    deleteButton.style.display = 'none'
    dialog.show()
  }

  /**
   * @param {string} salonId
   * @param {string} serviceId
   * @return {Promise}
   */
  function editService(salonId, serviceId) {
    return fetch('/schedule/' + salonId + '/service/' + serviceId, {
      credentials: 'same-origin',
      method: 'GET',
    })
    .then(fetchCheckStatus)
    .then(fetchParseJSON)
    .then(function(data) {
      nameFieldMaterial.value = data.service.name
      durationFieldMaterial.value = data.service.duration
      priceFieldMaterial.value = data.service.price
      descriptionFieldMaterial.value = data.service.description

      deleteButton.style.display = 'block';
      deleteButton.setAttribute('data-salon-id', salonId);
      deleteButton.setAttribute('data-service-id', serviceId);

      form.action = ('/schedule/' + salonId + '/service/' + serviceId);
      form.setAttribute('data-method', 'PUT')

      dialog.show()
    })
    .catch(handleError)
  }

  /**
   * Create or update a service
   * @param {*} event 
   */
  function saveService(event) {
    event.preventDefault();

    saveButton.disabled = true;
    
    fetch(form.action, {
      credentials: 'same-origin',
      method: form.getAttribute('data-method'),
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: nameFieldMaterial.value,
        duration: parseInt(durationFieldMaterial.value, 10),
        price: parseFloat(priceFieldMaterial.value) || 0,
        description: descriptionFieldMaterial.value,
      })
    })
    .then(fetchCheckStatus)
    .then(fetchParseJSONMeta)
    .then(function(resp) {
      handleJSONMeta(resp)
      saveButton.disabled = false;
    })
    .catch(function(error) {
      handleError(error)
      saveButton.disabled = false;
    })
  }

  function deleteService() {
    var serviceId = deleteButton.getAttribute('data-service-id');
    var salonId = deleteButton.getAttribute('data-salon-id');
  
    if (!serviceId) {
      alert('Ops, something goes wrong: user id is missed');
    }
  
    if (!salonId) {
      alert('Ops, something goes wrong: salon id is missed');
    }
  
    if (!confirm('Are you sure?')) {
      return;
    }
  
    deleteButton.disabled = true;

    return fetch('/schedule/' + salonId + '/service/' + serviceId, {
      credentials: 'same-origin',
      method: 'DELETE',
    })
    .then(fetchCheckStatus)
    .then(fetchParseJSONMeta)
    .then(function(resp) {
      handleJSONMeta(resp)
      deleteButton.disabled = false;
    })
    .catch(function(error) {
      alert(error)
      deleteButton.disabled = false;
    })
  }

  /**
   * Handle JSON Meta response
   */
  function handleJSONMeta(resp) {
    var error = resp && resp.meta && resp.meta[0];

    if(error) {
      return handleError(error)
    }

    if (resp.body) {
      services.salonServices.resetContent(resp.body);
    }

    form.reset();
    dialog.close()
  }

  /**
   * Handle error response
   * @param {Error} error
   */
  function handleError(error) {
    alert(error)
  }
}


/**
 * Get instance of ServiceDialog
 * @returns {ServiceDialog}
 */
function serviceDialog() {
  return serviceDialog.$i || (
    serviceDialog.$i = new ServiceDialog(document.querySelector('#service-dialog'))
  )
}

// Expose ServiceDialog as a singleton
Object.defineProperty(services, 'serviceDialog', { get: serviceDialog });

return services

})()
