const dotenv = require('dotenv');
const result = dotenv.config();

if (result.error) {
  const error = result.error as Error;

  console.warn(error.message);
}

interface Config_DEPRECATED {
  PORT: string | number;
  MONGODB_URI: string;
  REDIS_URL: string;
  APP_KEYLIST: string;
  GOOGLE_OAUTH2_CLIENT_ID: string;
  GOOGLE_OAUTH2_SECRET: string;
  GOOGLE_OAUTH2_REDIRECT_URL: string;
  GOOGLE_API_CLIENT_ID: string;
  GOOGLE_API_CLIENT_SECRET: string;
  GOOGLE_API_REDIRECT_URIS: string;
}

if (!process.env.PORT) {
  console.warn('No port config. Set PORT environment variable(default is 3000).');
}

if (!process.env.MONGODB_URI) {
  console.error('No MONGODB_URI config. Set MONGODB_URI environment variable.');
}

if (!process.env.REDIS_URL) {
  console.error('No redis config. Set REDIS_URL environment variable.');
}

if (!process.env.APP_KEYLIST) {
  console.error('No keylist config. Set APP_KEYLIST environment variable. The format is <string_key1>;<string_key2>.');
}

if (!process.env.GOOGLE_OAUTH2_CLIENT_ID) {
  console.warn('No google auth config. Set GOOGLE_OAUTH2_CLIENT_ID environment variable.');
}

if (!process.env.GOOGLE_OAUTH2_SECRET) {
  console.warn('No google auth config. Set GOOGLE_OAUTH2_SECRET environment variable.');
}

if (!process.env.GOOGLE_OAUTH2_REDIRECT_URL) {
  console.warn('No google auth config. Set GOOGLE_OAUTH2_REDIRECT_URL environment variable.');
}

if (!process.env.GOOGLE_API_CLIENT_ID) {
  console.warn('No google auth config. Set GOOGLE_API_CLIENT_ID environment variable.');
}

if (!process.env.GOOGLE_API_CLIENT_SECRET) {
  console.warn('No google auth config. Set GOOGLE_API_CLIENT_SECRET environment variable.');
}

if (!process.env.GOOGLE_API_REDIRECT_URIS) {
  console.warn('No google auth config. Set GOOGLE_API_REDIRECT_URIS environment variable.');
}

export const config_DEPRECATED: Config_DEPRECATED = {
  PORT: process.env.PORT || 3000,
  MONGODB_URI: process.env.MONGODB_URI || '',
  REDIS_URL: process.env.REDIS_URL || '',
  APP_KEYLIST: process.env.APP_KEYLIST || '',
  GOOGLE_OAUTH2_CLIENT_ID: process.env.GOOGLE_OAUTH2_CLIENT_ID || '',
  GOOGLE_OAUTH2_SECRET: process.env.GOOGLE_OAUTH2_SECRET || '',
  GOOGLE_OAUTH2_REDIRECT_URL: process.env.GOOGLE_OAUTH2_REDIRECT_URL || '',
  GOOGLE_API_CLIENT_ID: process.env.GOOGLE_API_CLIENT_ID || '',
  GOOGLE_API_CLIENT_SECRET: process.env.GOOGLE_API_CLIENT_SECRET || '',
  GOOGLE_API_REDIRECT_URIS: process.env.GOOGLE_API_REDIRECT_URIS || '',
};
