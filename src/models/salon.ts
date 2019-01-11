import { TimePeriod } from "./time-period";
import { SpecialHourPeriod } from "./special-hour-period";
import { ObjectID } from "bson";

export interface Salon {
  _id?: ObjectID
  alias: string;
  name: string;
  timezone: string;
  employees: SalonEmployees;
  services: SalonServices;
  regularHours: BusinessHours;
  specialHours: SpecialHours;
  created?: Date;
  updated?: Date;
}

export interface SalonEmployees {
  users: SalonEmployee[];
}

export interface SalonEmployee {
  id: ObjectID;
  position: string;
}

export interface SalonServices {
  lastServiceId: number;
  items: SalonService[]
}

export interface SalonService {
  id: number;
  name: string;
  description?: string;
  duration: number; // in minutes
  currencyCode: string; // ISO 4217
  price: number;
}

export interface BusinessHours {
  periods: TimePeriod[]
}

export interface SpecialHours {
  periods: SpecialHourPeriod[]
}
