interface User {
  id: number
  google_id: string
  google_meta: object
  meta: {

  }
  email: string
  first_name: string
  last_name: string
  password: string
  timezone: string
  logins: number
  last_login: Date
}

export default User
