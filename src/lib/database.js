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

module.exports.pool = () => pool
module.exports.connect = async () => await pool.connect()
