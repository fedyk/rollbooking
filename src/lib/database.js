const { Pool, Client } = require('pg')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
})

// the pool with emit an error on behalf of any idle clients
// it contains if a back-end error or network partition happens
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err)
  process.exit(-1)
})

/**
 * Params for query 
 * @typedef {Object} ExtractedQueryParam
 * @property {string[]} keys - The list of keys
 * @property {string[]} params - The list of params for `query` function, e.g. ['$1', '$2', '$3', ..]
 * @property {any[]} values - The list of values for query function
 */

/**
 * Extract params for `client.query` from raw data object.
 * 
 * @example
 *   const { keys, params, values } = extractQueryParams(user);
 *   const query = `UPDATE users SET (${keys.join(', ')}) = ROW(${params.join(', ')}) WHERE id = 1 RETURNING *;`
 *   const { rows } = await client.query(query, values);
 * @param {Object} data 
 * @returns {ExtractedQueryParam}
 */
function extractQueryParams(data) {
  const keys = Object.keys(data)
  const params = keys.map((v, i) => `$` + (i + 1))
  const values = Object.values(data)

  return { keys, params, values }
}

module.exports.pool = () => pool
module.exports.connect = async () => await pool.connect()
module.exports.extractQueryParams = extractQueryParams
