
const { extractQueryParams } = require('./../lib/database')

module.exports.getSalonById = async (client, id) => {
  const { rows } = await client.query('SELECT * FROM salons WHERE id=$1 LIMIT 1', [id])

  return rows.length > 0 ? rows[0] : null
}

module.exports.createSalon = async (client, salon) => {
  const keys = Object.keys(salon)
  const params = keys.map((v, i) => `$` + (i + 1))
  const values = Object.values(salon)
  const query = `INSERT INTO salons (${keys.join(', ')}) VALUES (${params.join(', ')}) RETURNING *`;

  const { rows } = await client.query(query, values);

  return rows.length > 0 ? rows[0] : null
}

module.exports.addUserToSalon = async (client, salonUser) => {
  const { keys, params, values } = extractQueryParams(salonUser)
  const query = `INSERT INTO salon_users (${keys.join(', ')}) VALUES (${params.join(', ')}) RETURNING *`;

  const { rows } = await client.query(query, values);

  return rows.length > 0 ? rows[0] : null
}
