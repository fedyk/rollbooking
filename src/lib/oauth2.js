const debug = require('debug')('lib:oauth2');
const { google } = require('googleapis');

// Return the instance of google oauth2 client
module.exports.googleOAuth2Client = function() {
  const CLIENT_ID = process.env.GOOGLE_OAUTH2_CLIENT_ID
  const SECRET = process.env.GOOGLE_OAUTH2_SECRET
  const REDIRECT_URL = process.env.GOOGLE_OAUTH2_REDIRECT_URL

  debug(`init google oauth with CLIENT_ID=%s, REDIRECT_URL=%s`, CLIENT_ID, REDIRECT_URL)

  /**
   * The instance of Google Auth Client
   * @more http://google.github.io/google-api-nodejs-client/#authentication-and-authorization
   */
  let oauth2Client;

  return function getOAuth2Client() {
    return oauth2Client || (oauth2Client = new google.auth.OAuth2(
      CLIENT_ID,
      SECRET,
      REDIRECT_URL
    ));
  }
}
