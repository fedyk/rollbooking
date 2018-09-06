import { PoolClient } from 'pg';
import { User } from '../models/user';
import { extractQueryParams } from '../lib/database';

export async function getUserById(client: PoolClient, id: number): Promise<User> {
  const { rows } = await client.query('SELECT * FROM users WHERE id=$1 LIMIT 1', [id])

  return rows.length > 0 ? rows[0] : null
}

export async function getUserByEmail(client: PoolClient, email: string): Promise<User> {
  const { rows } = await client.query('SELECT * FROM users WHERE email=$1 LIMIT 1', [email])

  return rows.length > 0 ? rows[0] : null
}

export async function getUserByGoogleId(client: PoolClient, googleId: string): Promise<User> {
  const { rows } = await client.query('SELECT * FROM users WHERE google_id=$1 LIMIT 1', [googleId])

  return rows.length > 0 ? rows[0] : null
}

export async function createUser(client: PoolClient, user: User): Promise<User> {
  const { keys, params, values } = extractQueryParams(user);
  const query = `INSERT INTO users (${keys.join(', ')})
    VALUES (${params.join(', ')})
    RETURNING *`;

  const { rows } = await client.query(query, values);

  return rows.length > 0 ? rows[0] : null
}

export async function updateUser(client: PoolClient, userId: number, user: User): Promise<User> {
  const { keys, params, values } = extractQueryParams(user);
  const query = `UPDATE users
    SET (${keys.join(', ')}) = ROW(${params.join(', ')})
    WHERE id = $${params.length + 1}
    RETURNING *;`;

  const { rows } = await client.query(query, values.concat(userId));

  return rows.length > 0 ? rows[0] : null
}

export async function getUsersByIds(client: PoolClient, usersIds: number[]): Promise<User[]> {
  const { rows } = await client.query('SELECT * FROM users WHERE id = ANY($1)', [usersIds])

  return rows
}
