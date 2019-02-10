#!/usr/bin/env node
const { execSync } = require("child_process");
const command = `cd ${__dirname}/../../packages/calendar && npm test`;

console.log(command);
execSync(command);
