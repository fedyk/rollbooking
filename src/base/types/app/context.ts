import * as Koa from "koa";
import { State } from "./state";

export interface Context extends Koa.Context {
  state: State;
}