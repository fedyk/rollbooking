import { stringMapJoin } from "../helpers/string-map-join";
import { stylesheet, script } from "../helpers/html";

interface Props {
  title: string;
  body: String;
  scripts?: string[];
  styles?: string[];
}

// Template as a class
export class Template {
  props: Props;

  constructor(props: Props) {
    this.props = props;
  }

  render() {
    return template(this.props)
  }

  toString() {
    return this.render();
  }
}

// Template as a function
export const template = (props: Props): string => `
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  ${stringMapJoin([
    "https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css"
  ].concat(props.styles), (href => stylesheet(href)))}
  <title>${escape(props.title)}</title>
</head>
<body>

<nav class="navbar navbar-dark bg-dark">
  <a class="navbar-brand" href="/">
    <img src="/images/logo-white.svg" height="24" class="d-inline-block align-middle" alt="rollbooking">
  </a>
</nav>

${props.body}
${stringMapJoin([
  "https://code.jquery.com/jquery-3.3.1.slim.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js",
  "https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js"
].concat(props.scripts), (src => script(src)))}
</body>
</html>
`
