import { stringMapJoin } from "../helpers/string-map-join";
import { stylesheet, script, escape } from "../helpers/html";

interface Props {
  title: string;
  description: string;
  body: String;
  scripts: string[];
  styles: string[];
}

// Template as a function
export const template = (props: Props): string => `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <title>${escape(props.title)}</title>
    <meta name="description" content="${escape(props.description)}">
    ${stringMapJoin(props.styles, (href => stylesheet(href)))}
  </head>
  <body>
    ${props.body}
    ${stringMapJoin(props.scripts, (src => script(src)))}
  </body>
</html>
`
