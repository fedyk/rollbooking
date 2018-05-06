var welcome = (window.welcome || {})

welcome.onloadLogo = function(image) {
  image.className += ' welcome__logo--ready'
}