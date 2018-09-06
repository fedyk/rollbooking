export interface UserProperties {
  google?: {
    accessToken?: string;
    emails: string[];
    scope?: string[];
    refreshToken?: string;
  };
  general: {
    name?: string;
    role?: string;
    timezone?: string;
  },
  invitation?: {
    from_user_id: number;
    to_salon_id: number;
  },
  salons?: {
    default_salon_id?: number
  }
}

export interface User {
  id: number
  google_id: string
  properties: UserProperties;
  email: string
  password: string
  logins: number
  last_login: Date
  created: Date
  updated: Date
}
