import User from './user'

interface SalonUser {
  user: User
  salon_id: number
  user_id: number;
  data?: {

  }
  created: Date
  updated: Date
}

export default SalonUser
