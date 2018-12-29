import { ObjectID } from "bson";
import * as passport from "koa-passport";
import * as Router from "koa-router";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { mapGoogleProfileToUser } from "../mappers/users";
import { SalonsCollection, UsersCollection } from "../adapters/mongodb";
import { User } from "../models/user";

export const router = new Router()

const scope = ['email', 'profile']

passport.serializeUser(function(user: User, done) {
  done(null, user._id.toHexString())
})

passport.deserializeUser(async function(id: number, done) {
  const $users = await SalonsCollection()

  if (!ObjectID.isValid(id)) {
    return done(new Error("User id is not valid ObjectID"))
  }

  try {
    const user = await $users.findOne({
      _id: new ObjectID(id)
    })

    done(null, user)
  }
  catch(err) {
    done(err)
  }
});

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_OAUTH2_CLIENT_ID,
  clientSecret: process.env.GOOGLE_OAUTH2_SECRET,
  callbackURL: process.env.GOOGLE_OAUTH2_REDIRECT_URL,
}, async function(accessToken, refreshToken, profile, done: (err: Error, user: User) => void) {
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
  catch(err) {
    done(err, null);
  }
}));

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
