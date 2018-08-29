import { User } from './user'

export interface SalonEvent {
  id: string;
  name: string;
  start: Date;
  end: Date;
  masterId: number;
}

export default SalonEvent
