export function getWelcomeView() {
  return `
    <div class="welcome">
      <div class="welcome__container">
          <img class="welcome__logo" src="/images/logo.svg" width="240" onload="welcome.onloadLogo(this)" />
      </div>
    </div>
  `
}
