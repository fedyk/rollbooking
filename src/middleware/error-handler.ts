import { inspect } from "util";
import { Middleware } from "../types";

/**
 * @example app.use(errorHandler)
 */
export const errorHandler: Middleware = (ctx, next) => {
  return Promise.resolve(next()).catch(function (err) {
    ctx.body = renderError(err.message, err)
    ctx.status = err.status || 500

    if (!err.status) {
      console.error(err)
    }
  })
}

function renderError(message: string, err: Error) {
  return `<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <meta name="theme-color" content="#000000">
    <link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro&display=swap" rel="stylesheet">
    <title>Something went wrong</title>
    <style>
      html,
      body {
        font-family: Source Sans Pro, -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica Neue, Arial, sans-serif;
        font-size: 15px;
        line-height: 1.46;
        color: #424d57;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }
      .container {
        padding: 28px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h2>Ops, something went wrong</h2>
      <p><strong>${message}</strong></p>
      <code>${inspect(err)}</code>
    </body>
  </html>`
}
