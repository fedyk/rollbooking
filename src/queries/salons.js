const { extractQueryParams } = require('./../lib/database')

/**
 * @typedef {Object} {SalonUser}
 * @property {number} salon_id
 * @property {number} user_id
 * @property {object} data
 */

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

/**
 * @param {PoolClient} client 
 * @param {number} userId 
 * @param {number} salonId
 * @param {object} newValues
 * @return {SalonUser}
 */
module.exports.updateUserToSalon = async function(client, userId, salonId, newValues) {
  const { keys, params, values } = extractQueryParams(newValues)
  const query = `UPDATE salon_users
    SET (${keys.join(',')}) = ROW(${params.join(', ')})
    WHERE user_id = $${params.length + 1} AND salon_id = $${params.length + 2}
    RETURNING *;`;

  const { rows } = await client.query(query, values.concat(userId, salonId));

  return rows.length > 0 ? rows[0] : null
}

/**
 * @param {PoolClient} client 
 * @param {number} userId 
 * @param {number} salonId
 */
module.exports.removeUserFromSalon = async function(client, userId, salonId, newValues) {
  const query = `DELETE FROM salon_users WHERE user_id = $1 AND salon_id = $2;`
  const { rows } = await client.query(query, [userId, salonId]);

  return rows;
}

module.exports.getSalonUsers = async (client, salonId) => {
  const query = `SELECT * FROM salon_users WHERE salon_id=$1`;

  const { rows } = await client.query(query, [salonId]);

  return rows
}

/**
 * @param {PoolClient} client
 * @param {number} salonId
 * @return {Array<{id: number, salon_id: number, data: object}>}
 */
module.exports.getSalonServices = async (client, salonId) => {
  const query = `SELECT * FROM salon_services WHERE salon_id=$1`;

  const { rows } = await client.query(query, [salonId]);

  return rows
}

/**
 * @param {PoolClient} client
 * @param {number} salonId
 * @param {number} serviceId
 * @return {Array<{id: number, salon_id: number, data: object}>}
 */
module.exports.getSalonService = async (client, salonId, serviceId) => {
  const query = `SELECT * FROM salon_services WHERE salon_id=$1 and id=$2`;

  const { rows } = await client.query(query, [salonId, serviceId]);

  return rows
}

/**
 * @param {PoolClient} client 
 * @param {Object} service
 */
module.exports.addServiceToSalon = async (client, service) => {
  const { keys, params, values } = extractQueryParams(service)
  const query = `INSERT INTO salon_services (${keys.join(', ')}) VALUES (${params.join(', ')}) RETURNING *`;

  const { rows } = await client.query(query, values);

  return rows.length > 0 ? rows[0] : null
}

/**
 * @param {PoolClient} client 
 * @param {number} salonId
 * @param {number} serviceId
 * @param {Object} service
 */
module.exports.updateServiceToSalon = async (client, salonId, serviceId, service) => {
  const { keys, params, values } = extractQueryParams(service)
  const query = `UPDATE salon_services
    SET (${keys.join(',')}) = ROW(${params.join(', ')})
    WHERE id = $${params.length + 1} AND salon_id = $${params.length + 2}
    RETURNING *;`;

  const { rows } = await client.query(query, values.concat(serviceId, salonId));

  return rows.length > 0 ? rows[0] : null
}

/**
 * @param {PoolClient} client 
 * @param {number} salonId
 * @param {number} serviceId
 */
module.exports.removeServiceFromSalon = async (client, salonId, serviceId) => {
  const query = `DELETE FROM salon_services WHERE salon_id = $1 AND id = $2;`

  const { rows } = await client.query(query, [salonId, serviceId]);

  return rows;
}
