import { ObjectID } from "bson";

export interface User {
  _id?: ObjectID;
  name: string;
  employers: SalonEmployers;
  googleId?: string;
  email: string;
  password: string;
  properties: UserProperties;
  created?: Date;
  updated?: Date;
}

export interface SalonEmployers {
  salons: SalonEmployer[];
}

export interface SalonEmployer {
  id: string;
}

export interface UserProperties {
  google?: {
    accessToken?: string;
    scope?: string[];
    refreshToken?: string;
  };
  invitation?: {
    from_user_id: number;
    to_salon_id: number;
  };
  salons?: {
    default_salon_id?: number;
  },
  avatar?: UserAvatar;
}

export interface UserAvatar {
  small: string;
  medium: string;
  big: string;
}