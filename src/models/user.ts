export interface UserProperties {
  google?: {
    accessToken?: string;
    emails: any[];
    scope?: string;
    refreshToken?: string;
  };
  general: {
    name?: string;
    role?: string;
    timezone?: string;
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
