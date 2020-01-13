import * as Koa from "koa";
import { MongoClient, Db } from "mongodb";

export interface Context extends Koa.Context {
  mongoClient: MongoClient
  mongoDatabase: Db
}

export interface State {
  title?: string;
  scripts?: string[];
  styles?: string[];
}
