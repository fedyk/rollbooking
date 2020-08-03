import * as crypto from "crypto"

export function getGravatarUrl(email: string) {
  const hash = crypto.createHash('md5').update(email).digest("hex")

  return `https://www.gravatar.com/avatar/${hash}.jpg?s=512&d=mp`
}
