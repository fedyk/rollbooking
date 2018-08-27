export function mapGoogleProfileToUser (profile, meta) {
  return {
    google_id: profile.id,
    google_meta: Object.assign({ json: profile._json || null }, meta),
    email: profile.emails.map(v => v.value)[0] || '',
    first_name: (profile.name && profile.name.givenName || ''),
    last_name: (profile.name && profile.name.familyName || ''),
    password: '',
    logins: 0,
    last_login: new Date(),
  }
}

