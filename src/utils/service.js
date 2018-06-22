module.exports.getServiceName = (service) => {
  return service && service.data && service.data.name || ''
}

module.exports.getServicePrice = (service) => {
  return service && service.data && service.data.price || -1;
}

module.exports.getServiceDuration = (service) => {
  return service && service.data && service.data.duration || -1;
}

module.exports.getServiceDescription = (service) => {
  return service && service.data && service.data.description || ''
}
