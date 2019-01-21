#!/usr/bin/env node
//
// This script allows to build all sub packages
//
// Usage:
//
//     node scripts/build-packages.js
//

const { execSync } = require("child_process");

execSync(`cd ${__dirname}/../packages/calendar && npm install`);
execSync(`cd ${__dirname}/../packages/calendar && npm run build`);
