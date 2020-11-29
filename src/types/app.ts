import * as Koa from "koa";
import { Db, WithId } from "mongodb";
import { Reservations } from "../data-access/reservations";
import { Customers } from "../data-access/customers";
import { Invitations } from "../data-access/invitations";
import { Organizations } from "../data-access/organizations";
import { Reviews } from "../data-access/reviews";
import { User, Users } from "../data-access/users";
import { RouterParamContext } from "@koa/router";

interface ISession {
  userId?: string
}

interface IContext {
  mongo: Db
  organizations: Organizations
  users: Users
  reservations: Reservations
  customers: Customers
  reviews: Reviews
  invitations: Invitations
  session: ISession
}

interface IState {
  user?: WithId<User>

  // template related props
  title: string;
  description: string;
  scripts?: string[];
  styles?: string[];
  alerts: {
    text: string
    type: "primary" | "secondary" | "success" | "danger" | "warning" | "info"
  }[]
}

export type Context = Koa.ParameterizedContext<IState, IContext & RouterParamContext<IState, IContext>>
export type Middleware = Koa.Middleware<IState, IContext & RouterParamContext<IState, IContext>>
