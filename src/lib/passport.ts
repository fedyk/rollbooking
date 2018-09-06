import * as passport from "koa-passport";
import * as Router from "koa-router";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { connect } from "./database";
import { getUserById, getUserByGoogleId, createUser } from "../queries/users";
import { mapGoogleProfileToUser } from "../mappers/users";

export const router = new Router()
const scope = ['email', 'profile']

passport.serializeUser(async function(user: any, done) {
  done(null, user.id)
})

passport.deserializeUser(async function(id: number, done) {
  const client = await connect();
  try {
    const user = await getUserById(client, id)
    done(null, user)
  }
  catch(err) {
    done(err)
  }
  client.release();
});

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_OAUTH2_CLIENT_ID,
  clientSecret: process.env.GOOGLE_OAUTH2_SECRET,
  callbackURL: process.env.GOOGLE_OAUTH2_REDIRECT_URL,
}, async function(accessToken, refreshToken, profile, done) {
  const client = await connect();
  debugger
  try {
    const user = await getUserByGoogleId(client, profile.id)

    // User already present is DB
    if (user) {
      return client.release(), done(null, user);
    }

    // Create new user model
    const newUser = mapGoogleProfileToUser(profile, { accessToken, refreshToken, scope })

    // Put user in database
    const createdUser = await createUser(client, newUser)

    done(null, createdUser)
  }
  catch(e) {
    done(e);
  }

  client.release();
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
