import * as crypto from "crypto"
import * as config from "../config"

export function hash(password: string): string {
  return crypto.createHash("sha256").update(password + config.SALT).digest("hex")
}
