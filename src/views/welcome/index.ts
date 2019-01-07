export function welcome() {
  return `<div class="welcome">
    <div class="welcome__container">
        <img class="welcome__logo" src="/images/logo.svg" width="240" onload="welcome.onloadLogo(this)" />
    </div>
  </div>
  <link rel="stylesheet" href="css/welcome.css?1">
  <script src="js/welcome.js?1"></script>
  `
}
