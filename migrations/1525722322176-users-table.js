const config = require('../built/lib/config')
const { connect } = require('../built/lib/database')

module.exports.up = async () => {
  const client = await connect()

  await client.query(`CREATE TABLE IF NOT EXISTS users
  (
    id serial,
    google_id varchar(32) NULL DEFAULT NULL,
    properties json,
    email varchar(254) NOT NULL,
    "password" varchar(64),
    logins integer NOT NULL DEFAULT 0,
    last_login TIMESTAMPTZ,
    created TIMESTAMPTZ NOT NULL,
    updated TIMESTAMPTZ NOT NULL,
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
