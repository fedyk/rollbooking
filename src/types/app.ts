import * as Koa from "koa";
import { MongoClient, Db } from "mongodb";
import { User } from "../accounts";

export interface Context extends Koa.Context {
  mongoClient: MongoClient
  mongoDatabase: Db
}

export interface State {
  title?: string;
  scripts?: string[];
  styles?: string[];
  user?: User
}

export type Middleware = Koa.Middleware<State, Context>;
