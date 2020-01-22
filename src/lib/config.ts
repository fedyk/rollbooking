require('dotenv').config();

if (!process.env.APP_KEYS) {
  throw new Error('No keys config. Set APP_KEYS environment variable. The format is <string_key1>;<string_key2>.')
}

if (!process.env.MONGODB_URI) {
  throw new Error('No MONGODB_URI config. Set MONGODB_URI environment variable.')
}

if (!process.env.SALT) {
  throw new Error('No SALT config. Set SALT environment variable.')
}

export const PORT = process.env.PORT || 3000
export const APP_KEYS = process.env.APP_KEYS + ""
export const MONGODB_URI = process.env.MONGODB_URI + ""
export const SALT = process.env.SALT
