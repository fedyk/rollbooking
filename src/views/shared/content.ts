import { escape } from "../../helpers/html";

interface Props {
  body: string;
  userName: string;
  isAuthenticated: boolean;
    
}

export const content = ({ body, isAuthenticated, userName }: Props) => `
<div class="d-flex flex-column flex-md-row align-items-center p-3 px-md-4 mb-3 bg-white border-bottom shadow-sm">
  <h5 class="my-0 mr-md-auto font-weight-normal">Company name</h5>
  <nav class="my-2 my-md-0 mr-md-3">
    <a class="p-2 text-dark" href="#">Features</a>
    <a class="p-2 text-dark" href="#">Enterprise</a>
    <a class="p-2 text-dark" href="#">Support</a>
    <a class="p-2 text-dark" href="#">Pricing</a>
  </nav>
  <a class="btn btn-outline-primary" href="#">Sign up</a>
</div>

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

<div class="container">${body}</div>

<div class="container pt-4 pb-4">
  © 2019 Rollbooking
  <div class="float-right">
    <a href="/salons" class="text-secondary">Salons</a>
  </div>
</nav>
`