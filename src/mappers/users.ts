import { User, UserProperties } from "../models/user";
import { plus_v1 } from "googleapis";

export function mapGoogleProfileToUser(
  profile: plus_v1.Schema$Person,
  {
    accessToken,
    refreshToken,
    scope
  }
): User {
  const name = `${profile.name && profile.name.givenName} ${profile.name && profile.name.familyName}`.trim();
  const email = Array.isArray(profile.emails)
    && profile.emails.length > 0
    && profile.emails[0].value || null;

  const properties: UserProperties = {
    google: {
      scope,
      emails: Array.isArray(profile.emails) ? profile.emails.map(v => v && v.value || v) : profile.emails,
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
    created: new Date(),
    updated: new Date(),
  }
}

