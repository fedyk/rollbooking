import * as Koa from "koa";
import { MongoClient, Db } from "mongodb";
import { User, Business } from "../accounts";

export interface Context extends Koa.Context {
  mongoClient: MongoClient
  mongoDatabase: Db
}

export interface State {
  user?: User
  business?: Business

  // template related props
  title?: string;
  scripts?: string[];
  styles?: string[];
}

export type Middleware = Koa.Middleware<State, Context>;
