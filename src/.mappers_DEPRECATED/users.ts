import { User, UserProperties } from "../types/user";
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
      accessToken,
      refreshToken,
      scope
    },
  }

  return {
    name: name,
    googleId: profile.id,
    email: email,
    employers: {
      salons: []
    },
    properties,
    password: null,
    created: new Date(),
    updated: new Date(),
  }
}

