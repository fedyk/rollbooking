import * as ejs from "ejs";
import { session } from "./session"
import * as types from "../types";
import { stringMapJoin } from "../helpers/string-map-join";
import { stylesheet, script, escape_DEPRECATE } from "../helpers/html";

/**
 * @example
 * ```
 * router.get("/", template, async (ctx) => {
 *   ctx.body = "Content";
 * })
 * ```
 */
export const template: types.Middleware = async (ctx, next) => {
  ctx.state.scripts = [
    "/js/jquery.js",
    "/js/popper.js",
    "/js/bootstrap.js",
  ]

  ctx.state.styles = [
    "/css/bootstrap.css",
    "/css/bootstrap-theme.css",
  ]

  ctx.state.title = "Rollbooking";
  ctx.response.type = "html"

  await next()

  ctx.body = renderTemplate({
    title: ctx.state.title,
    description: ctx.state.description,
    body: ctx.body,
    scripts: ctx.state.scripts,
    styles: ctx.state.styles,
  })
}

interface Props {
  title: string;
  description: string;
  body: String;
  scripts: string[];
  styles: string[];
}

// Template as a function
const renderTemplate = (props: Props): string => /*html*/`
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <title>${escape_DEPRECATE(props.title)}</title>
  <meta name="description" content="${escape_DEPRECATE(props.description)}">
  <link rel="icon" type="image/png" href="/images/favicon.png">
  <link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro&display=swap" rel="stylesheet">
  ${stringMapJoin(props.styles, (href => stylesheet(href)))}
</head>
<body>
  ${props.body}
  ${stringMapJoin(props.scripts, (src => script(src)))}
</body>
</html>
`
