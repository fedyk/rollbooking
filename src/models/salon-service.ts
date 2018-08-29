import { User } from './user'

export interface SalonServiceProperties {
  general: {
    name: string;
    duration: number;
    description?: string;
  },
  price: {
    value: number;
    currency: string;
  }
}

export interface SalonService {
  id: number;
  salon_id: number;
  properties: SalonServiceProperties;
  created: Date;
  updated: Date;
}
