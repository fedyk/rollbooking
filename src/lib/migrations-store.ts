import './config';
import { connect } from "./database";

class Store {

  async save(set, fn) {
    try {
      const client = await connect();

      await this.createTable(client)

      const { rows: storeRows } = await client.query(`SELECT store FROM migrations LIMIT 1`)
      
      if (storeRows.length === 0) {
        await client.query(`INSERT INTO migrations(store) VALUES ($1)`, [set])
      }
      else {
        await client.query(`UPDATE migrations SET store=$1`, [set])
      }

      fn(null)
    }
    catch(e) {
      fn(e)
    }
  }

  async load(fn) {
    try {
      const client = await connect();

      await this.createTable(client)
      
      const { rows } = await client.query(`SELECT store FROM migrations LIMIT 1`)
      
      fn(null, rows[0] || {})
    }
    catch(e) {
      fn(e)
    }
  }

  async createTable(client) {
    await client.query(`
      CREATE TABLE IF NOT EXISTS migrations ("store" json);
    `)
  }
}

module.exports = Store
