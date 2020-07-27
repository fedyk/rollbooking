import * as Koa from "koa";
import { MongoClient, Db } from "mongodb";
import { User } from "../models/users";

export interface Context extends Koa.Context {
  mongo: Db
}

export interface State {
  user?: User

  // template related props
  title?: string;
  scripts?: string[];
  styles?: string[];
}

export type Middleware<TState = {}, TContext = {}> = Koa.Middleware<TState & State, TContext & Context>
