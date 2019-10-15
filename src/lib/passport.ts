import { ObjectID } from "bson";
import * as passport from "koa-passport";
import * as Router from "@koa/router";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { mapGoogleProfileToUser } from "../mappers/users";
import { UsersCollection } from "../adapters/mongodb";
import { User } from "../types/user";

export const router = new Router()

const scope = ['email', 'profile'];

passport.serializeUser(serializeUser)
passport.deserializeUser(deserializeUser);
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_OAUTH2_CLIENT_ID,
  clientSecret: process.env.GOOGLE_OAUTH2_SECRET,
  callbackURL: process.env.GOOGLE_OAUTH2_REDIRECT_URL,
}, passportGoogleStrategy));

router.get('/google', passport.authenticate('google', {
  scope,
  successRedirect: '/',
  failureRedirect: '/'
}));

router.get('/logout', ctx => {
  ctx.logout()
  ctx.redirect('/login')
});

export const initialize = () => passport.initialize();
export const session = () => passport.session();
export const onlyAuthenticated = async (ctx, next) => !ctx.isAuthenticated() ? ctx.redirect('/login') : next()

interface SelectParam<Context> {
  guest: (ctx: Context) => void
  loggedIn: (ctx: Context) => void
}

export function select<Context = any>(params: SelectParam<Context>) {
  return function(ctx: Context) {
    return (ctx as any).isAuthenticated() ? params.loggedIn(ctx) : params.guest(ctx)
  }
}

async function serializeUser(user: User, done) {
  done(null, user._id.toHexString());
}

async function deserializeUser(id: number, done) {
  const $users = await UsersCollection();

  if (!ObjectID.isValid(id)) {
    return done(new Error("User id is not valid ObjectID"))
  }

  try {
    const user = await $users.findOne({
      _id: new ObjectID(id)
    })

    done(null, user)
  }
  catch (err) {
    done(err)
  }
}

async function passportGoogleStrategy(accessToken, refreshToken, profile, done: (err: Error, user: User) => void) {
  try {
    const $user = await UsersCollection();

    let user = await $user.findOne({
      googleId: profile.id
    });

    // User already present is storage
    if (user) {
      return done(null, user);
    }

    // Create new user model
    user = mapGoogleProfileToUser(profile, { accessToken, refreshToken, scope })

    // Put user in database
    const { insertedId } = await $user.insertOne(user);

    user._id = insertedId;

    done(null, user)
  }
  catch (err) {
    done(err, null);
  }
}