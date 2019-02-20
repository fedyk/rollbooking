import { footer } from "./footer";

interface Props {
  body: string;
}

export const content = ({ body }: Props) => `
<nav class="navbar navbar-dark bg-dark">
  <a class="navbar-brand" href="/">
    <img src="/images/logo-white.svg" height="24" class="d-inline-block align-middle" alt="rollbooking">
  </a>
</nav>

<div class="container pt-4">
${body}
</div>

${footer()}
`