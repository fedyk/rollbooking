import { escape } from "../../helpers/html";

interface Props {
  body: string;
  alias: string;
}

export const content = ({ body, alias }: Props) => `
<nav class="navbar navbar-dark bg-dark">
  <a class="navbar-brand" href="/">
    <img src="/images/logo-white.svg" height="24" class="d-inline-block align-middle" alt="rollbooking">
  </a>
</nav>

<div class="container pt-4">
  <div class="row">
    <div class="col-sm-2">
      <nav class="nav flex-column">
        <a class="nav-link" href="${escape(`/${alias}/calendar`)}">Calendar</a>
        <a class="nav-link" href="${escape(`/${alias}/clients`)}">Clients</a>
        <a class="nav-link" href="${escape(`/${alias}/settings`)}">Settings</a>      
      </nav>
    </div>
    <div class="col-sm-10">
      ${body}
    </div>
  </div>
</div>

<div class="container pt-4">© 2019 rollbooking</nav>
`