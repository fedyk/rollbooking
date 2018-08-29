import { User, UserProperties } from "../models/user";
import { plus_v1 } from "googleapis";

export function mapGoogleProfileToUser(profile: plus_v1.Schema$Person, { accessToken, refreshToken, scope }): User {
  const name = `${profile.name && profile.name.givenName} ${profile.name && profile.name.familyName}`.trim();
  const email = profile.emails && profile.emails[0] || null;
  const properties: UserProperties = {
    google: {
      scope,
      emails: profile.emails,
      accessToken,
      refreshToken,
    },
    general: {
      name: name,
      role: '',
      timezone: null,
    }
  }

  return {
    id: null,
    google_id: profile.id,
    email: email,
    properties,
    password: null,
    logins: 0,
    last_login: new Date(),
  }
}

