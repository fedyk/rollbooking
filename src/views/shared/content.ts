import { escape } from "../../helpers/html";

interface Props {
  body: string;
  userName: string;
  isAuthenticated: boolean;
    
}

export const content = ({ body, isAuthenticated, userName }: Props) => `
<nav class="navbar navbar-dark bg-dark">
  <div class="container">
    <a class="navbar-brand" href="/">
      <img src="/images/logo-white.svg" height="24" class="d-inline-block align-middle" alt="rollbooking">
    </a>

    ${isAuthenticated ? `<ul class="navbar-nav">
      <li class="nav-item active">
        <a class="nav-link" href="/profile">${escape(userName)}</a>
      </li>
    </ul>` : ""}
  </div>
</nav>

<div class="container pt-4">
${body}
</div>

<div class="container pt-4 pb-4">
  © 2019 Rollbooking
  <div class="float-right">
    <a href="/salons" class="text-secondary">Salons</a>
  </div>
</nav>
`