import { User } from "../../core/types/user";
import { Salon } from "../../core/types/salon";
import { DayOfWeek } from "../../core/types/dat-of-week";
import { UsersCollection_DEPRECATED, SalonsCollection_DEPRECATED, closeClient } from "../../core/db/mongodb";

export async function createTestSalon(): Promise<Salon> {
  const $users = await UsersCollection_DEPRECATED();
  const $salons = await SalonsCollection_DEPRECATED();
  const randomId = Math.round(Math.random() * 1000000);

  const user1: User = {
    name: "Test User 1",
    email: `user+1+${randomId}@example.com`,
    password: "",
    properties: {},
    employers: {
      salons: [],
    }
  }

  const user2: User = {
    name: "Test User 2",
    email: `user+2+${randomId}@example.com`,
    password: "",
    properties: {},
    employers: {
      salons: [],
    }
  }

  const { insertedId: userId1 } = await $users.insertOne(user1);
  const { insertedId: userId2 } = await $users.insertOne(user2);

  const salon: Salon = {
    _version: "v2",
    alias: `test-salon-${randomId}`,
    name: `Test Salon`,
    description: "",
    timezone: "Europe/Berlin",
    employees: {
      users: [{
        id: userId1,
        position: "User Test Position"
      }, {
        id: userId2,
        position: "User Test Position"
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
      }, {
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

  const { insertedId: salonId, ops: [createdTestSalon] } = await $salons.insertOne(salon);
 
  $users.updateMany({
    _id: {
      $in: [userId1, userId2]
    }
  }, {
    $push: {
      "employers.salons": salonId
    }
  });

  return createdTestSalon as Salon;
}

if (!module.parent) {
  createTestSalon()
    .then(salon => console.log("Test salon was successfully created: salonId: %s", salon._id))
    .catch(error => console.error(error))
    .then(() => process.exit())
}