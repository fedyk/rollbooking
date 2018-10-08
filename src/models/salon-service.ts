import { User } from './user'

export interface SalonServiceProperties {
  general: {
    name: string;
    duration: number; // in minutes
    description?: string;
  },
  price: {
    value: number;
  }
}

export interface SalonService {
  id: number;
  salon_id: number;
  properties: SalonServiceProperties;
  created: Date;
  updated: Date;
}
