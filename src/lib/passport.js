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
  try {
    const user = await getUserById(id)
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
}, async function(accessToken, refreshToken, profile, done) {
  const client = await connect();
  debugger
  try {
    const user = await getUserByGoogleId(profile.id, client)

    if (user) {
      return client.release(), done(null, user);
    }

    const newUser = mapGoogleProfileToUser(profile, { accessToken, refreshToken, scope })

    const createdUser = await createUser(newUser)

    done(null, createdUser)
  }
  catch(e) {
    debugger
    done(e);
  }

  client.release();
}));

router.get('/google', passport.authenticate('google', {
  scope,
  successRedirect: '/',
  failureRedirect: '/'
}));

module.exports.router = router;
module.exports.initialize = () => passport.initialize();
module.exports.session = () => passport.session();

