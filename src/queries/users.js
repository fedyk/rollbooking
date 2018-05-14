module.exports.getUserById = async (client, id) => {
  const { rows } = await client.query('SELECT * FROM users WHERE id=$1 LIMIT 1', [id])

  return rows.length > 0 ? rows[0] : null
}

module.exports.getUserByGoogleId = async (client, googleId) => {
  const { rows } = await client.query('SELECT * FROM users WHERE google_id=$1 LIMIT 1', [googleId])

  return rows.length > 0 ? rows[0] : null
}

module.exports.createUser = async (client, user) => {
  const keys = Object.keys(user)
  const params = keys.map((v, i) => `$` + (i + 1))
  const values = Object.values(user)
  const query = `INSERT INTO users (${keys.join(', ')}) VALUES (${params.join(', ')}) RETURNING *`;

  const { rows } = await client.query(query, values);

  return rows.length > 0 ? rows[0] : null
}

module.exports.updateUser = async (client, user, id) => {
  const keys = Object.keys(user)
  const params = keys.map((v, i) => `$` + (i + 1))
  const values = Object.values(user)
  const query = `UPDATE users SET (${keys.join(', ')}) = ROW(${params.join(', ')}) WHERE id = $${params.length + 1} RETURNING *;`;

  const { rows } = await client.query(query, values.concat(id));

  return rows.length > 0 ? rows[0] : null
}
