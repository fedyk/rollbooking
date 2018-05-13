const config = require('../src/lib/config')
const { connect } = require('../src/lib/database')

module.exports.up = async () => {
  const client = await connect()

  await client.query(`CREATE TABLE IF NOT EXISTS salon_workers
  (
    id serial,
    user_id integer NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    salon_id integer NOT NULL REFERENCES salons(id) ON DELETE CASCADE,
    role varchar(32) NOT NULL,
    calendar_id varchar(128) NOT NULL,
    created TIMESTAMPTZ NOT NULL,
    updated TIMESTAMPTZ NOT NULL,
    CONSTRAINT salon_workers_id_pkey PRIMARY KEY (id)
  );`)

  client.release();
}

module.exports.down = async () => {
  const client = await connect()

  await client.query(`DROP TABLE salon_workers;`)

  client.release();
}
