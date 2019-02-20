import { escape, attrs } from "../../helpers/html";
import { footer } from "../shared/footer";

interface Props {
  isAuthenticated: boolean;
  userName: string;
  userAvatarUrl: string;
  salonAlias: string;
  salonName: string;
  body: String;
}

export const bookingLayoutView = (props: Props): string => `
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">
  <link rel="stylesheet" href="/css/booking.css?2">
  <title>${escape(props.salonName)}</title>
</head>
<body>

<nav class="site-header py-1 mb-3">
  <div class="container d-flex flex-column flex-md-row justify-content-between align-items-center">
    <a class="py-2 d-inline-block" href="/${escape(props.salonAlias)}/booking">${escape(props.salonName)}</a>
    ${props.isAuthenticated ? `<a ${attrs({ class: "d-inline-block", href: "/profile" })}>
      ${props.userAvatarUrl ? `<img ${attrs({ href: props.userAvatarUrl, "class": "mr-2" })} />` : ''}
      ${escape(props.userName)}
    </a>` : ''}
  </div>
</nav>

${props.body}

${footer()}

<script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js" integrity="sha384-ZMP7rVo3mIykV+2+9J3UJ46jBk0WLaUAdn689aCwoqbBJiSnjAK/l8WvCWPIPm49" crossorigin="anonymous"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js" integrity="sha384-ChfqqxuZUCnJSK3+MXmPNIyE6ZbWh2IMqE241rYiqJxyMiZ6OW/JmZQ5stwEULTy" crossorigin="anonymous"></script>
</body>
</html>
`
