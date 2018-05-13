const passport = require('koa-passport');
const router = require('koa-router')();
const { connect } = require('./database');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { getUserById, getUserByGoogleId, createUser } = require('../queries/users');
const { mapGoogleProfileToUser } = require('../mappers/users');
const scope = ['email', 'profile'];

passport.serializeUser(async function(user, done) {
  done(null, user.id)
})

passport.deserializeUser(async function(id, done) {
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

const onlyAuthenticated = 

module.exports.router = router;
module.exports.initialize = () => passport.initialize();
module.exports.session = () => passport.session();
module.exports.onlyAuthenticated = async (ctx, next) => !ctx.isAuthenticated() ? ctx.redirect('/login') : next()
