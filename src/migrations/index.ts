import * as fs from "fs";
import * as path from "path";
import { Db } from "mongodb";

interface TMigrationSchema {
  _id: string
  currentMigrationRevision: number
}

export async function runMigrations(db: Db) {
  const definedMigrations = getMigrationFiles()
  const currentRevision = await getCurrMigrationRevision(db)
  const migrationsToRun = definedMigrations.filter(migration => migration.revision > currentRevision)
  let nextRevision = currentRevision

  for (let i = 0; i < migrationsToRun.length; i++) {
    const migrationToRun = migrationsToRun[i]

    await migrationToRun.up(db)

    nextRevision = migrationToRun.revision
  }

  if (nextRevision !== undefined && currentRevision !== nextRevision) {
    await setCurrMigrationRevision(db, nextRevision)
  }

  return nextRevision
}

function getMigrationFiles() {
  return fs.readdirSync(__dirname)
    .filter(fileName => /^\d+\.(js|ts)$/.test(fileName)) // only .js/.ts files
    .map(fileName => parseMigrationFile(fileName))
    .sort((a, b) => a.revision - b.revision)
}

function parseMigrationFile(fileName: string) {
  const revision = Number(fileName.split(".")[0])

  if (Number.isNaN(revision)) {
    throw new Error(`file "${fileName}" should have a number as filename`)
  }

  const migration = require(path.join(__dirname, fileName))

  if (!migration) {
    throw new Error(`file "${fileName}" should have exported object with "up" and "down" methods`)
  }

  const up = migration.up as (db: Db) => Promise<any>

  if (typeof up !== "function") {
    throw new Error(`file "${fileName}" should have exported function 'up(db) { ... }'`)
  }

  return {
    revision,
    up
  }
}

function getCurrMigrationRevision(db: Db) {
  return db.collection<TMigrationSchema>("migrations")
    .findOne({
      _id: "migration"
    })
    .then(function (item) {
      return item && item.currentMigrationRevision ? Number(item.currentMigrationRevision) : 0
    })
}

function setCurrMigrationRevision(db: Db, currMigrationRevision: number) {
  return db.collection<TMigrationSchema>("migrations")
    .findOneAndUpdate({
      "_id": "migration"
    }, {
      currentMigrationRevision: currMigrationRevision
    }, {
      upsert: true
    })
}
