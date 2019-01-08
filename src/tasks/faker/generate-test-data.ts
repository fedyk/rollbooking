import { UsersCollection, SalonsCollection, closeClient } from "../../adapters/mongodb";
import { User, SalonEmployer } from "../../models/user";
import { createHash } from "crypto";
import { Salon } from "../../models/salon";
import { DayOfWeek } from "../../models/dat-of-week";


const DEFAULT_TIME_ZONES = [
  "America/Los_Angeles",

  "MST",
  "America/Phoenix",

  "America/Chicago",

  "EST",
  "America/New_York",

  "Europe/Amsterdam",

  "Europe/Berlin",
  "Europe/Kiev",
  "Europe/Moscow",
  "Pacific/Auckland",
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
          openTime: {
            hours: 10,
            minutes: 0,
            seconds: 0
          },
          closeDay: DayOfWeek.MONDAY,
          closeTime: {
            hours: 16,
            minutes: 0,
            seconds: 0
          },
        }, {
          openDay: DayOfWeek.TUESDAY,
          openTime: {
            hours: 10,
            minutes: 0,
            seconds: 0
          },
          closeDay: DayOfWeek.TUESDAY,
          closeTime: {
            hours: 16,
            minutes: 0,
            seconds: 0
          },
        }, {
          openDay: DayOfWeek.WEDNESDAY,
          openTime: {
            hours: 10,
            minutes: 0,
            seconds: 0
          },
          closeDay: DayOfWeek.WEDNESDAY,
          closeTime: {
            hours: 16,
            minutes: 0,
            seconds: 0
          },
        },{
          openDay: DayOfWeek.THURSDAY,
          openTime: {
            hours: 10,
            minutes: 0,
            seconds: 0
          },
          closeDay: DayOfWeek.THURSDAY,
          closeTime: {
            hours: 16,
            minutes: 0,
            seconds: 0
          },
        }, {
          openDay: DayOfWeek.FRIDAY,
          openTime: {
            hours: 10,
            minutes: 0,
            seconds: 0
          },
          closeDay: DayOfWeek.FRIDAY,
          closeTime: {
            hours: 16,
            minutes: 0,
            seconds: 0
          },
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
