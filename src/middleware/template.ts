import Debug from "debug"
import { Middleware } from "koa";
import * as ejs from "ejs";
import { session } from "./session"
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

export const template: Middleware<State, Context> = async (ctx, next) => {
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

  await session(ctx, next)

  ctx.response.type = "html"

  const body = renderContent({
    isAuthenticated: !!ctx.state.user,
    userName: ctx.state.user ? ctx.state.user.name : null,
    userId: ctx.state.user ? ctx.state.user.id : null,
    body: ctx.body
  })

  ctx.body = renderTemplate({
    title: ctx.state.title,
    description: "",
    body: body,
    scripts: ctx.state.scripts,
    styles: ctx.state.styles,
  });
}

interface TemplateProps {
  title: string;
  description: string;
  body: String;
  scripts: string[];
  styles: string[];
}

// Template as a function
const renderTemplate = (props: TemplateProps): string => /*html*/`
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
  userId?: string;
  userName?: string;
  isAuthenticated: boolean;
}

function renderContent(props: ContentProps) {
  return ejs.render(/*html*/`
  <div class="mb-3 bg-white border-bottom">
  
    <div class="container d-flex flex-column flex-md-row align-items-center pt-2 pb-2">
      <a class="my-0 mr-md-auto" href="/" title="Home">
        <img src="/images/logo.svg" width="128" height="30">
      </a>
  
      <nav class="my-2 my-md-0 mr-md-3">
        <a class="p-2 text-dark" href="/explore">Explore</a>
      </nav>
  
      ${props.isAuthenticated
      ? `<a class="btn btn-link" href="/p/${props.userId}"><%= props.userName %></a>`
      : `<a class="btn btn-link" href="/login">Sign in</a>`
    }
    </div>
  </div>
  
  <div class="container">${props.body}</div>
  
  <div class="container pt-4 pb-4">© 2020 Rollbooking</div>
  `, { props })
}
