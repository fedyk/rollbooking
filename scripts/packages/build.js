#!/usr/bin/env node
//
// This script allows to build all sub packages
//
//     node scripts/build-packages.js

const { execSync } = require("child_process");
const commands = [
  `cd ${__dirname}/../../packages/calendar && npm install`,
  `cd ${__dirname}/../../packages/calendar && npm run build`,
  `cd ${__dirname}/../../packages/calendar && npm run test`
];

commands.forEach(function(command) {
  console.log(command);
  execSync(command);
});
