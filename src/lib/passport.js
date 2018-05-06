const passport = require('koa-passport');
const router = require('koa-router')();
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.serializeUser(async function(user, done) {
  done(null, user.id)
})

passport.deserializeUser(async function(user, done) {
  try {
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
}, function(accessToken, refreshToken, profile, done) {
  debugger
  done(null, profile)
}));

router.get('/google', passport.authenticate('google', {
  scope: ['email', 'profile'],
  successRedirect: '/',
  failureRedirect: '/'
}));

module.exports.router = router;
module.exports.initialize = () => passport.initialize();
module.exports.session = () => passport.session();
