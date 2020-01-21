import * as crypto from "crypto"

export function uniqId() {
  return crypto.randomBytes(4).toString("hex")
}
