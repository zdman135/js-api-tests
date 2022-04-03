const path = require('path');
require('dotenv').config()

let env = process.env.ENV;

if (!env) {
  env = "stage";
}
// prevent running on prod for now
if (env == "prod" || env == "Prod") {
  env = "stage"
}

const conffile = `${env}.env.json`;
const confpath = path.join(__dirname, 'lib/env', conffile);
let envConfig = require(confpath);

envConfig.token = process.env[`${conffile.split(".")[0].toUpperCase()}_TOKEN`]
console.log(`Using Environment ${conffile}`)

module.exports = {
  envConfig,
};
