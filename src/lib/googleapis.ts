import * as readline from 'readline';
import { google } from 'googleapis';
import debugFactory from 'debug'
import { instance as redisInstance } from './redis';

const debug = debugFactory('lib:googleapis');

/**
 * More information here:
 * @see https://developers.google.com/calendar/quickstart/nodejs
 * @see https://github.com/google/google-api-nodejs-client
 */

const SCOPES = [
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/calendar.readonly',
];
const TOKEN_KEY = 'google:api:token';

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 */
export async function authorize() {
  const client_id = process.env.GOOGLE_API_CLIENT_ID;
  const client_secret = process.env.GOOGLE_API_CLIENT_SECRET;
  const redirect_uris = process.env.GOOGLE_API_REDIRECT_URIS.split(',');
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
  const redis = redisInstance();
  let token = {};

  try {
    token = await redis.get(TOKEN_KEY);

    token = JSON.parse(token as string);

    if (!token) throw new Error('No token in store');
  }
  catch (err) {
    token = await getAccessToken(oAuth2Client);

    await redis.set(TOKEN_KEY, JSON.stringify(token))
  }

  oAuth2Client.setCredentials(token);

  return oAuth2Client;
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 */
export async function getAccessToken(oAuth2Client) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });

  console.log('Authorize this app by visiting this url: ', authUrl);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve, reject) => {
    rl.question('Enter the code from that page here: ', (code) => {
      rl.close();
  
      oAuth2Client.getToken(code, (err, token) => {
        if (err) {
          return reject(err);
        }

        resolve(token);
      });
    });
  });
}
