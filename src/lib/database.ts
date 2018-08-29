import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
})

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err)
  process.exit(-1)
})

export function extractQueryParams<T>(data: object): {
  keys: string[];
  params: string[];
  values: T[]
} {
  const keys = Object.keys(data);
  const params = keys.map((v, i) => `$` + (i + 1));
  const values = Object.values(data);

  return {
    keys,
    params,
    values
  }
}

export async function connect() {
  return await pool.connect()
}
