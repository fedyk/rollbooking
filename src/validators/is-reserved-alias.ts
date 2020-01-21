const reserved = new Set([
  "user",
  "users",
  "profile",
  "help",
  "business",
  "booking",
  "city",
  "search",
  "explore",
  "settings",
  "login",
  "join",
  "auth",
  "poc",
  "privacy",
])

export function isReserverAlias(alias: string) {
  return reserved.has(alias)
  
}