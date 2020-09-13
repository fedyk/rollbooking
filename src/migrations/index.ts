import * as fs from "fs";
import * as path from "path";
import { Db } from "mongodb";

export async function up(db: Db) {
  const definedMigrations = getDefinedMigrations()
  const lastMigrationRevisiton = await getLastMigrationRevision(db)
  const migrationsToRun = lastMigrationRevisiton == null
    ? definedMigrations
    : definedMigrations.filter(function (migration) {
      return migration.revisiton > lastMigrationRevisiton
    })
  let nextMigrationRevisiton: number | void = void 0

  for (let i = 0; i < migrationsToRun.length; i++) {
    const migrationToRun = migrationsToRun[i]

    await migrationToRun.up(db)

    nextMigrationRevisiton = migrationToRun.revisiton
  }

  if (nextMigrationRevisiton != null) {
    await setLastMigrationRevision(db, nextMigrationRevisiton)
  }
}

function getDefinedMigrations() {
  return fs.readdirSync(__dirname)
    .filter(function (basename) {
      return /^\d+\.(js|ts)$/.test(basename)
    })
    .map(function (basename) {
      const revision = Number(basename.split(".")[0])

      if (Number.isNaN(revision)) {
        throw new Error(`file "${basename}" should have only digits in the name`)
      }

      const migration = require(path.join(__dirname, basename))

      if (!migration) {
        throw new Error(`file "${basename}" should have exported object`)
      }

      const up = migration.up as (db: Db) => Promise<any>
      const down = migration.down as (db: Db) => Promise<any>

      if (typeof up !== "function") {
        throw new Error(`file "${basename}" should have exported function 'up(db) { ... }'`)
      }

      if (typeof down !== "function") {
        throw new Error(`file "${basename}" should have exported function 'down(db) { ... }'`)
      }

      return {
        revisiton: revision,
        up,
        down
      }
    })
    .sort(function (a, b) {
      return a.revisiton - b.revisiton
    })
}

function getLastMigrationRevision(db: Db) {
  return db.collection("migrations")
    .findOne({
      _id: "migration"
    })
    .then(function (item) {
      return item && item.last_migration_revision ? Number(item.last_migration_revision) : undefined
    })
}

function setLastMigrationRevision(db: Db, lastMigrationRevisiton: number) {
  return db.collection("migrations")
    .findOneAndUpdate({
      _id: "migration"
    }, {
      "$set": {
        last_migration_revision: lastMigrationRevisiton
      }
    }, {
      upsert: true
    })
}