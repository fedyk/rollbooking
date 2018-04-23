const debug = require('debug')('pages:oauth2')

async function google(ctx) {
  const oauth2Client = ctx.googleOAuth2Client();
  const queryCode = ctx.query.code || '';

  if (queryCode) {
    const { tokens } = await oauth2Client.getToken(queryCode);

    oauth2Client.setCredentials(tokens);

    ctx.body = JSON.stringify(tokens);
  }
  else {
    ctx.redirect(generateAuthUrl());
    ctx.body = 'Redirecting to Google ';
  }

  function generateAuthUrl() {
    return oauth2Client.generateAuthUrl({

      // 'online' (default) or 'offline' (gets refresh_token)
      access_type: 'offline',


      // If you only need one scope you can pass it as a string
      scope: [
        'profile',
        'email',
        'https://www.googleapis.com/auth/calendar'
      ]
    });
  }
}


module.exports.google = google
