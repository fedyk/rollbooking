function onFilterServices(formElement, event) {
  if (event) {
    event.preventDefault()
  }

  var salonId = formElement.salonId.value
  var date = formElement.date.value
  var masterId = formElement.masterId.value
  var serviceId = formElement.serviceId.value
  var timerId = setTimeout(startServicesLoading, 200);

  fetchFilteredServices(salonId, date, masterId, serviceId).then(function(html) {
    clearInterval(timerId)
    stopServicesLoading()
    updateFilterServiceBody(html)
  })
  .catch(function(error) {
    clearInterval(timerId)
    stopServicesLoading()
  })
}

function onChangeDate() {
  var formElement = document.getElementById('reservation-filters-form');

  if (!formElement) {
    return;
  }

  onFilterServices(formElement);
}

function onChangeMaster() {
  var formElement = document.getElementById('reservation-filters-form');

  if (!formElement) {
    return;
  }

  onFilterServices(formElement);

}

function onChangeService() {
  var formElement = document.getElementById('reservation-filters-form');

  if (!formElement) {
    return;
  }

  onFilterServices(formElement);
}

function fetchFilteredServices(salonId, date, masterId, serviceId) {
  var url = '/widgets/reservation/' + salonId + '/get-services';
  var params = {
    credentials: 'same-origin',
		method: 'POST',
		body: JSON.stringify({
      d: date,
      m: masterId,
      s: serviceId
    })
  }

  return fetch(url, params)
    .then(fetchCheckStatus)
    .then(function(resp) {
      return resp.text()
	  })
}

function startServicesLoading() {

  /** @type {HTMLDivElement[]} */
  var servicesElements = document.getElementsByClassName('rw-service');

  for (let i = 0; i < servicesElements.length; i++) {
    addClass(servicesElements[i], 'rw-service--loading')
  }
}

function stopServicesLoading() {
  /** @type {HTMLDivElement[]} */
  var servicesElements = document.getElementsByClassName('rw-service');

  for (let i = 0; i < servicesElements.length; i++) {
    removeClass(servicesElements[i], 'rw-service--loading')
  }
}

/**
 * @param {string} innerHTML
 */
function updateFilterServiceBody(innerHTML) {

  /** @type {HTMLDivElement} */
  var containerElement = document.getElementById('reservation-services-container');

  if (containerElement) {
    containerElement.innerHTML = innerHTML
  }
}
