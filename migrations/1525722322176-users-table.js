const config = require('../src/lib/config')
const { connect } = require('../src/lib/database')

module.exports.up = async () => {
  const client = await connect()

  await client.query(`CREATE TABLE IF NOT EXISTS users
  (
    id serial,
    google_id varchar(32) NOT NULL DEFAULT '0',
    google_meta json,
    email varchar(254) NOT NULL,
    first_name varchar(32),
    last_name varchar(32),
    "password" varchar(64),
    logins integer NOT NULL DEFAULT 0,
    last_login TIMESTAMPTZ,
    CONSTRAINT users_id_pkey PRIMARY KEY (id),
    CONSTRAINT users_email_key UNIQUE (email),
    CONSTRAINT users_google_id_key UNIQUE (google_id),
    CONSTRAINT users_logins_check CHECK (logins >= 0)
  );`)

  await client.query(`CREATE TABLE IF NOT EXISTS user_tokens
  (
    id serial,
    user_id integer NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    user_agent varchar(40) NOT NULL,
    token character varying(32) NOT NULL,
    created TIMESTAMPTZ NOT NULL,
    expires TIMESTAMPTZ NOT NULL,
    CONSTRAINT user_tokens_id_pkey PRIMARY KEY (id),
    CONSTRAINT user_tokens_token_key UNIQUE (token)
  );`)

  client.release();
}

module.exports.down = async () => {
  const client = await connect()

  await client.query(`DROP TABLE user_tokens`)
  await client.query(`DROP TABLE users`)

  client.release();
}
