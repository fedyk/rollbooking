export interface SalonProperties {
  general: {
    timezone: string;
  }
}

export interface Salon {
  id: number;
  name: string;
  properties: SalonProperties;
  created: Date;
  updated: Date;
}

export default Salon
