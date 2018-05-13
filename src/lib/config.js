const dotenv = require('dotenv');
const result = dotenv.config();

if (result.error) {
  throw result.error
}

if (!process.env.DATABASE_URL) {
  console.log('No database config. Set DATABASE_URL environment variable.');
}

if (!process.env.REDIS_URL) {
  console.log('No redis config. Set REDIS_URL environment variable.');
}

if (!process.env.APP_KEYLIST) {
  console.log('No keylist config. Set APP_KEYLIST environment variable. The format is <string_key1>;<string_key2>.');
}

if (!process.env.GOOGLE_OAUTH2_CLIENT_ID) {
  console.log('No google auth config. Set GOOGLE_OAUTH2_CLIENT_ID environment variable.');
}

if (!process.env.GOOGLE_OAUTH2_SECRET) {
  console.log('No google auth config. Set GOOGLE_OAUTH2_SECRET environment variable.');
}

if (!process.env.GOOGLE_OAUTH2_REDIRECT_URL) {
  console.log('No google auth config. Set GOOGLE_OAUTH2_REDIRECT_URL environment variable.');
}

if (!process.env.GOOGLE_API_CLIENT_ID) {
  console.log('No google auth config. Set GOOGLE_API_CLIENT_ID environment variable.');
}

if (!process.env.GOOGLE_API_CLIENT_SECRET) {
  console.log('No google auth config. Set GOOGLE_API_CLIENT_SECRET environment variable.');
}

if (!process.env.GOOGLE_API_REDIRECT_URIS) {
  console.log('No google auth config. Set GOOGLE_API_REDIRECT_URIS environment variable.');
}

module.exports = result.parsed;
