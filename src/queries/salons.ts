import { extractQueryParams } from '../lib/database'
import { PoolClient } from 'pg';
import Salon from '../models/salon';
import { SalonUser } from '../models/salon-user';
import { SalonService } from '../models/salon-service';

export async function getSalonById(client: PoolClient, id: number): Promise<Salon> {
  const { rows } = await client.query('SELECT * FROM salons WHERE id=$1 LIMIT 1', [id])

  return rows.length > 0 ? rows[0] : null
}

export async function createSalon(client: PoolClient, salon: Salon): Promise<Salon> {
  const { keys, params, values } = extractQueryParams(salon);
  const query = `INSERT INTO salons (${keys.join(', ')}) VALUES (${params.join(', ')}) RETURNING *`;

  const { rows } = await client.query(query, values);

  return rows.length > 0 ? rows[0] : null
}

export async function addSalonUser(client: PoolClient, salonUser: SalonUser): Promise<SalonUser> {
  const { keys, params, values } = extractQueryParams(salonUser)
  const query = `INSERT INTO salon_users (${keys.join(', ')}) VALUES (${params.join(', ')}) RETURNING *`;

  const { rows } = await client.query(query, values);

  return rows.length > 0 ? rows[0] : null
}


export async function updateSalonUser(
  client: PoolClient,
  salonId: number,
  userId: number,
  newValues: SalonUser
): Promise<SalonUser> {
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
export async function removeUserFromSalon(client: PoolClient, userId: number, salonId: number): Promise<any> {
  const query = `DELETE FROM salon_users WHERE user_id = $1 AND salon_id = $2;`
  const { rows } = await client.query(query, [userId, salonId]);

  return rows;
}

export async function getSalonUsers(client: PoolClient, salonId): Promise<SalonUser[]> {
  const query = `SELECT * FROM salon_users WHERE salon_id=$1`;

  const { rows } = await client.query(query, [salonId]);

  return rows
}

/**
 * @param {PoolClient} client
 * @param {number} salonId
 * @return {Array<{id: number, salon_id: number, data: object}>}
 */
export async function getSalonServices(client: PoolClient, salonId): Promise<SalonService[]> {
  const query = `SELECT * FROM salon_services WHERE salon_id=$1`;

  const { rows } = await client.query(query, [salonId]);

  return rows
}

export async function getSalonService(client: PoolClient, salonId: number, serviceId: number): Promise<SalonService> {
  const query = `SELECT * FROM salon_services WHERE salon_id=$1 and id=$2`;

  const { rows } = await client.query(query, [salonId, serviceId]);

  return rows.length > 0 ? rows[0] : null
}

export async function addSalonService(client: PoolClient, service: SalonService): Promise<any> {
  const { keys, params, values } = extractQueryParams(service)
  const query = `INSERT INTO salon_services (${keys.join(', ')}) VALUES (${params.join(', ')}) RETURNING *`;

  const { rows } = await client.query(query, values);

  return rows.length > 0 ? rows[0] : null
}

export async function updateSalonService(client: PoolClient, salonId: number, serviceId: number, service: SalonService): Promise<SalonService> {
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
export async function removeServiceFromSalon(client: PoolClient, salonId, serviceId): Promise<any> {
  const query = `DELETE FROM salon_services WHERE salon_id = $1 AND id = $2;`

  const { rows } = await client.query(query, [salonId, serviceId]);

  return rows;
}

export async function getUserSalons(client: PoolClient, userId: number): Promise<SalonUser[]> {
  const { rows } = await client.query('SELECT * FROM salon_users WHERE user_id=$1', [userId])

  return rows
}

export async function getSalonUser(client: PoolClient, salonId: number, userId: number): Promise<SalonUser> {
  const { rows } = await client.query('SELECT * FROM salon_users WHERE user_id=$1 AND salon_id=$2 LIMIT 1', [userId, salonId])

  return rows.length > 0 ? rows[0] : null
}
