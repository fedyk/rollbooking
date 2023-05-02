import * as React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { Context } from "./types"

export function privacy(ctx: Context) {
  ctx.body = renderToStaticMarkup(render())
}

function render() {
  return <>
    <h3>Privacy Policy</h3>
    <p>Test</p>
  </>
}
