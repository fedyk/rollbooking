import * as Koa from "koa";
import { MongoClient, Db } from "mongodb";
import { User } from "../accounts";

export interface Context extends Koa.Context {
  mongoClient: MongoClient
  mongoDatabase: Db
}

export interface State {
  user?: User

  // template related props
  title?: string;
  scripts?: string[];
  styles?: string[];
}

export type Middleware = Koa.Middleware<State, Context>;
