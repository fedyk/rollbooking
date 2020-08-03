import Router = require("@koa/router")
import { HOST } from "../config"

export function getUrl(path: string, params: object) {
  return base() + Router.url(path, params)
}

export function base() {
  return "http://" + HOST
}
