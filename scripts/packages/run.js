#!/usr/bin/env node
const { join } = require("path");
const { execSync } = require("child_process");

const subCommand = process.argv.slice(2).join(" ");

const commands = [
  `cd ${join(__dirname, "../../packages/bootstrap")} && npm ${subCommand}`,
  `cd ${join(__dirname, "../../packages/calendar")} && npm ${subCommand}`
]

for (let i = 0; i < commands.length; i++) {
  const command = commands[i];
  console.log(command)
  execSync(command);
}
