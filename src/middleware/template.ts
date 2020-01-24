import Debug from "debug"
import { Middleware } from "koa";
import { State, Context } from "../types/app";
import { stringMapJoin } from "../helpers/string-map-join";
import { stylesheet, script, escape_DEPRECATE } from "../helpers/html";

const debug = Debug("template")

/**
 * @example
 * 
 * Code:
 * ```
 * router.get("/", template, async (ctx) => {
 *   ctx.body = "Hello";
 * })
 * ```
 */

export const template: Middleware<State, Context> = async(ctx, next) => {
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

  await next()

  const isAuthenticated = ctx.isAuthenticated ? ctx.isAuthenticated() : false;
  const userName = isAuthenticated ? ctx.state.user.name : null;

  // todo: do we need mobile support
  const body = renderContent({
    isAuthenticated: isAuthenticated,
    userName: userName,
    body: ctx.body
  })

  ctx.response.type = "html";

  ctx.body = renderTemplate({
    title: ctx.state.title,
    description: "",
    body: body,
    scripts: ctx.state.scripts,
    styles: ctx.state.styles,
  });
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

interface ContentProps {
  body: string;
  userName: string;
  isAuthenticated: boolean;
}

const renderContent = ({ body, isAuthenticated, userName }: ContentProps) => /*html*/`
<div class="mb-3 bg-white border-bottom">

  <div class="container d-flex flex-column flex-md-row align-items-center pt-2 pb-2">
    <a class="my-0 mr-md-auto" href="/" title="Home">
      <img src="/images/logo.svg" width="128" height="30">
    </a>

    <nav class="my-2 my-md-0 mr-md-3">
      <a class="p-2 text-dark" href="/salons">Salons</a>
    </nav>

    ${isAuthenticated
    ? `<a class="btn btn-link" href="/profile">${escape_DEPRECATE(userName)}</a>`
    : `<a class="btn btn-link" href="/login">Sign in</a> <a class="btn btn-outline-primary" href="/join">Sign up</a>`
  }
  </div>
</div>

<div class="container">${body}</div>

<div class="container pt-4 pb-4">© 2019 Rollbooking</nav>
`