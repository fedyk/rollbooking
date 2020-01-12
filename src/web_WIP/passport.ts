import { ObjectID } from "bson";
// import * as Router from "@koa/router"
// import * as passport from "koa-passport";
import { App$Context } from "./types";
// import { Strategy as GoogleStrategy } from "passport-google-oauth20";
// import { mapGoogleProfileToUser } from "../mappers/users";
// import { UsersCollection } from "../adapters/mongodb";
// import { User } from "../types/user";

// export const router = new Router()

// const scope = ['email', 'profile'];

// passport.serializeUser(serializeUser)
// passport.deserializeUser(deserializeUser);
// passport.use(new GoogleStrategy({
//   clientID: process.env.GOOGLE_OAUTH2_CLIENT_ID,
//   clientSecret: process.env.GOOGLE_OAUTH2_SECRET,
//   callbackURL: process.env.GOOGLE_OAUTH2_REDIRECT_URL,
// }, passportGoogleStrategy));

// router.get('/google', passport.authenticate('google', {
//   scope,
//   successRedirect: '/',
//   failureRedirect: '/'
// }));

// router.get('/logout', ctx => {
//   ctx.logout()
//   ctx.redirect('/login')
// });

// export const initialize = () => passport.initialize();
// export const session = () => passport.session();

export function onlyAuthenticated(ctx: App$Context, next: () => void) {
  if (ctx.isAuthenticated()) {
    return next()
  }
  else {
    ctx.throw("401", new Error("You are not authorized"))
  }
}

interface SelectParams {
  guest: (ctx: App$Context) => void
  authenticated: (ctx: App$Context) => void
}

export function select(params: SelectParams) {
  return function(ctx: App$Context) {
    if (ctx.isAuthenticated()) {
      return params.authenticated(ctx)
    }
    else {
      return params.guest(ctx)
    }
  }
}

// function serializeUser(user: User, done) {
//   done(null, user._id.toHexString());
// }

// async function deSerializeUser(id: number, done) {
//   const $users = await UsersCollection();

//   if (!ObjectID.isValid(id)) {
//     return done(new Error("User id is not valid ObjectID"))
//   }

//   try {
//     const user = await $users.findOne({
//       _id: new ObjectID(id)
//     })

//     done(null, user)
//   }
//   catch (err) {
//     done(err)
//   }
// }

// async function passportGoogleStrategy(accessToken, refreshToken, profile, done: (err: Error, user: User) => void) {
//   try {
//     const $user = await UsersCollection();

//     let user = await $user.findOne({
//       googleId: profile.id
//     });

//     // User already present is storage
//     if (user) {
//       return done(null, user);
//     }

//     // Create new user model
//     user = mapGoogleProfileToUser(profile, { accessToken, refreshToken, scope })

//     // Put user in database
//     const { insertedId } = await $user.insertOne(user);

//     user._id = insertedId;

//     done(null, user)
//   }
//   catch (err) {
//     done(err, null);
//   }
// }