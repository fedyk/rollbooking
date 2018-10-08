export interface SalonProperties {
  general: {
    timezone: string;
  },
  currency: {
    symbol: string; // e.g. $
    value: string;  // e.g. USD
  };
}

export interface Salon {
  id: number;
  name: string;
  properties: SalonProperties;
  created: Date;
  updated: Date;
}

export default Salon
