import * as Koa from "koa";
import { Db } from "mongodb";
import { User } from "../models/users";

export type ParameterizedContext = Koa.ParameterizedContext<State, Context>

export interface Context extends Koa.Context {
  mongo: Db
}

export interface State {
  user?: User

  // template related props
  title?: string;
  scripts?: string[];
  styles?: string[];
  alerts?: {
    text: string
    type: "primary" | "secondary" | "success" | "danger" | "warning" | "info"
  }[]
}

export type Middleware = Koa.Middleware<State, ParameterizedContext>
