import { SalonService } from "../../models/salon-service";

export interface Settings {
  salonId: number;
  error?: Error;
  salonServices: SalonService[];
}
