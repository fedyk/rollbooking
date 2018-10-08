import { removeServiceFromSalon } from '../queries/salons'
import { PoolClient } from "pg";

export async function deleteSalonService(client: PoolClient, salonId: number, serviceId: number) {
  return await removeServiceFromSalon(client, salonId, serviceId)
}
