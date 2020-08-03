import * as crypto from "crypto"
import * as config from "../config"

export function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password + config.SALT).digest("hex")
}
