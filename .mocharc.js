const request = require("supertest")("");
const expect = require("chai").expect;
const faker = require('faker');

// process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

module.exports = {
  request,
  expect,
  faker,
  diff: true,
  extension: ['js'],
  package: './package.json',
  spec: 'tests/**/*.test.js',
  slow: 75,
  timeout: 30000,
  ui: "bdd",
  file: 'setup.js'
  //  exclude: "path to files or pattern"
};

// reporter: '',
// reporterOptions: {
//   reportDir: "reports",
// }
// --reporter-options 
// reportDir=customReportDir,reportFilename=customReportFilename