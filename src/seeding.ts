import { MONGODB_URI } from "./config"
import { createClient, getDatabase, closeClient } from "./storage"
import { User, createUser, createUsers } from "./users"
import { uniqId } from "./lib/uniq-id"
import { Account, Service, EmployeeRole, createAccount } from "./account"
import { TimePeriod } from "./types/time-period"
import { DayOfWeek } from "./types"

/**
 * Fill storage with random data for simplifying dev/tests
 */
seeding().then(() => console.log("done"))

async function seeding() {
  const mongo = await createClient(MONGODB_URI)

  try {
    const db = getDatabase(mongo)
    const user = getRandomUser()
    const employees = getRandomUsers(getRandomNumber(4, 20))
    const account = getRandomAccount(user, employees)

    // relations
    user.defaultBusinessId = account.id
    user.ownedBusinessIds.push(account.id)
    account.ownerId = user.id

    employees.forEach(employee => employee.defaultBusinessId = account.id)

    await createUser(db, user)
    await createUsers(db, employees)
    await createAccount(db, account)
  }
  catch (err) {
    console.error(err)
  }
  finally {
    await closeClient(mongo)
  }
}

function getRandomAccount(owner: User, employees: User[]): Account {
  const name = getRandomAccountName()
  const services = getRandomServices()
  const regularHours = getRandomRegularHours()

  return {
    id: uniqId(),
    name,
    desc: getRandomDescription(),
    timezone: getRandomTimezone(),
    alias: getAlias(name),
    avatar: getAvatar(name),
    ownerId: owner.id,
    employees: employees.map(u => ({
      id: u.id,
      name: u.name,
      avatar: u.avatar,
      role: getRandomEmplRole(),
      position: getRandomDescription()
    })),
    services: services,
    regularHours: regularHours,
    specialHours: [],
    createdAt: new Date(),
    updatedAt: new Date()
  }
}

function getRandomUsers(amount: number) {
  const users: User[] = new Array(amount)

  for (let i = 0; i < amount; i++) {
    users[i] = getRandomUser()
  }

  return users
}

function getRandomUser(): User {
  const name = getRandomUserName()
  const email = getUserEmail(name)

  return {
    id: uniqId(),
    name,
    email,
    timezone: getRandomTimezone(),
    alias: getAlias(name),
    avatar: getAvatar(name),
    ownedBusinessIds: [],
    defaultBusinessId: null
  }
}

function getRandomAccountName() {
  return getRandomItem(["Barber", "Whisperers", "Whisperers", "Bartenders"]) + " " + getRandomItem(["booth", "shaven", "grocee", "garages"])
}

function getRandomUserName() {
  return getRandomItem(["John", "Tedd", "Adamanart", "Sanndeep"]) + " " + getRandomItem(["Mateusiak", "Grzegonszczekewicz", "Tod", "Smith"])
}

function getRandomServiceName() {
  return getRandomItem(["Hair", "Nail", "Beard", "Hands", "Strzyżenie", "Stylizacja"]) + getRandomItem([" and Father&Son", " & Fresh Lines", " and Shave", "& Care"])
}

function getRandomTimezone() {
  return getRandomItem(["America/Los_Angeles", "America/New_York", "Europe/Warsaw", "Europe/Kiev"])
}

function getUserEmail(userName: string) {
  return getAlias(userName) + "@example.com"
}

function getAlias(name: string) {
  return name.replace(/\d/, "_").toLowerCase()
}

function getAvatar(name: string) {
  return "https://i.pravatar.cc/512?u=" + decodeURIComponent(name)
}

function getRandomItem<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function getRandomDescription() {
  const text = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum".split(" ")
  const end = Math.floor(Math.random() * text.length)

  return text.slice(0, end).join(" ")
}

function getRandomServices(): Service[] {
  const count = Math.floor(Math.random() * 20)
  const services: Service[] = []

  for (let i = 0; i < count; i++) {
    services.push(getRandomService())
  }

  return services
}

function getRandomService(): Service {
  return {
    id: uniqId(),
    name: getRandomServiceName(),
    description: getRandomDescription(),
    duration: 30 + Math.floor(Math.random() * 5) * 5,
    currencyCode: "USD",
    price: Math.floor(Math.random() * 100) % 15,
  }
}

function getRandomEmplRole(): EmployeeRole {
  return getRandomItem([EmployeeRole.Admin, EmployeeRole.Normal])
}

/**
 * @todo add more variety of hours
 */
function getRandomRegularHours(): TimePeriod[] {
  const days = [DayOfWeek.MONDAY, DayOfWeek.THURSDAY, DayOfWeek.WEDNESDAY, DayOfWeek.THURSDAY, DayOfWeek.FRIDAY]
  const startHour = 8 + Math.floor(Math.random() * 4)
  const endHour = 16 + Math.floor(Math.random() * 4)


  return days.map(day => ({
    openDay: day,
    closeDay: day,
    openTime: { hours: startHour, minutes: 0, seconds: 0 },
    closeTime: { hours: endHour, minutes: 0, seconds: 0 }
  }))
}

function getRandomNumber(min: number, max: number) {
  return min + Math.floor(Math.random() * max - min)
}