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
${body}
</div>

<div class="container pt-4 pb-4">© 2019 rollbooking</nav>
`