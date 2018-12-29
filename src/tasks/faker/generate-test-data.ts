import { UsersCollection, SalonsCollection, closeClient } from "../../adapters/mongodb";
import { User, SalonEmployer } from "../../models/user";
import { createHash } from "crypto";
import { Salon } from "../../models/salon";
import { DayOfWeek } from "../../models/dat-of-week";


const DEFAULT_TIME_ZONES = [
  // "PST",
  // "America/Los_Angeles",

  // "MST",
  // "America/Phoenix",

  // "CST",
  // "America/Chicago",

  // "EST",
  // "America/New_York",

  // "Europe/Amsterdam",

  "Europe/Berlin",
  "Europe/Kiev",
  "Europe/Moscow"
]

export async function generateTestData(timeZones = DEFAULT_TIME_ZONES) {
  const $users = await UsersCollection();
  const $salons = await SalonsCollection();

  const userHash = createHash("sha256").update(Math.random().toString()).digest("hex").substr(0, 8);
  const user: User = {
    name: "Auto Generate Test User",
    employers: {
      salons: []
    },
    email: `email${userHash}@example.com`,
    password: "",
    properties: {},
  }

  const userInsertResult = await $users.insertOne(user);

  for (let i = 0; i < timeZones.length; i++) {
    const timezone = timeZones[i];
    const userHash = createHash("sha256").update(Math.random().toString()).digest("hex").substr(0, 4);

    const salon: Salon = {
      alias: `salon-${userHash}`,
      name: `Salon ${userHash} ${timezone}`,
      timezone: timezone,
      employees: {
        users: [{
          id: userInsertResult.insertedId.toHexString(),
          position: ""
        }]
      },
      services: {
        lastServiceId: 3,
        items: [{
          id: 1,
          duration: 60,
          name: "Test Service 1",
          currencyCode: "USD",
          price: 100
        }, {
          id: 2,
          duration: 60,
          name: "Test Service 2",
          currencyCode: "USD",
          price: 100.50
        }, {
          id: 3,
          duration: 60,
          name: "Test Service 3",
          currencyCode: "USD",
          price: 5.50
        }]
      },
      regularHours: {
        periods: [{
          openDay: DayOfWeek.MONDAY,
          openTime: "10:00",
          closeDay: DayOfWeek.MONDAY,
          closeTime: "16:00",
        }, {
          openDay: DayOfWeek.TUESDAY,
          openTime: "10:00",
          closeDay: DayOfWeek.TUESDAY,
          closeTime: "16:00",
        }, {
          openDay: DayOfWeek.WEDNESDAY,
          openTime: "10:00",
          closeDay: DayOfWeek.WEDNESDAY,
          closeTime: "16:00",
        },{
          openDay: DayOfWeek.THURSDAY,
          openTime: "10:00",
          closeDay: DayOfWeek.THURSDAY,
          closeTime: "16:00",
        }, {
          openDay: DayOfWeek.FRIDAY,
          openTime: "10:00",
          closeDay: DayOfWeek.FRIDAY,
          closeTime: "16:00",
        }]
      },
      specialHours: {
        periods: []
      }
    }

    const insertOneResult = await $salons.insertOne(salon);

    console.log("Generated salon with id", insertOneResult.insertedId)

    // const $push: Partial<User> = {
    //   employers: {
    //     salonsIds: [{
    //     }]
    //   }
    // }

    // Update user
    // await $users.updateOne({
    //   _id: userInsertResult.insertedId
    // }, {
    //   $push: {
    //     "employers.$[].salons": {
    //       id: insertOneResult.insertedId.toHexString(),
    //     } as SalonEmployer
    //   }
    // })
  }
}

if (!module.parent) {
  (async function() {
    try {
      console.log("Start")

      await generateTestData()

      console.log("Success");
    }
    catch(e) {
      console.error("Fail", e);
    }
    finally {
      await closeClient()
    }
  })()
}
