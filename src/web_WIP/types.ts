import { Context } from "koa";

export interface App$Context extends Context {
  isAuthenticated(): boolean
}

export interface App$State {

}