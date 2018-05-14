const config = require('../src/lib/config')
const { connect } = require('../src/lib/database')

module.exports.up = async () => {
  const client = await connect()

  await client.query(`CREATE TABLE IF NOT EXISTS salons
  (
    id serial,
    name varchar(254) NOT NULL,
    timezone varchar(64),
    meta json,
    created TIMESTAMPTZ NOT NULL,
    updated TIMESTAMPTZ NOT NULL,
    CONSTRAINT salons_id_pkey PRIMARY KEY (id)
  );`)

  client.release();
}

module.exports.down = async () => {
  const client = await connect()

  await client.query(`DROP TABLE salons`)

  client.release();
}
