const { connect } = require('../lib/database')

module.exports.getUserById = async (id) => {
  const client = await connect()
  const { rows } = await client.query('SELECT * FROM users WHERE id=$1 LIMIT 1', [id])

  return client.release(), rows.length > 0 ? rows[0] : null
}

module.exports.getUserByGoogleId = async (googleId) => {
  const client = await connect()
  const { rows } = await client.query('SELECT * FROM users WHERE google_id=$1 LIMIT 1', [googleId])

  return client.release(), rows.length > 0 ? rows[0] : null
}

module.exports.createUser = async (user) => {
  const keys = Object.keys(user)
  const params = keys.map((v, i) => `$` + (i + 1))
  const values = Object.values(user)
  const query = `INSERT INTO users (${keys.join(', ')}) VALUES (${params.join(', ')}) RETURNING *`;
  const client = await connect()

  const { rows } = await client.query(query, values);

  return client.release(), rows.length > 0 ? rows[0] : null
}
