# Intro
API Tests for Driver Product
Testing done using supertest sending requests to the Driver Product endpoints

## Prerequisites
Node

# Setup
1. Clone repository: `git clone <git repo url>`
2. In the root of the project, install node packages: `npm install`
3. Create a .env file in the root of the project:

```
DEVEL_TOKEN=
STAGE_TOKEN=
PROD_TOKEN=
TEST25_TOKEN=
```
Add in the auth token related to each environment needed
`NOTE: do not add the auth tokens directly into the json environment files.`

# Usage
1. Execute tests - `npm test`
default - runs against stage environment

To specify another environment add `ENV=<testEnvironment>`: `ENV=test1 npm test`

To include html report: `npm run test-report-html`
The html report will be generated to the `mochawesome-report` directory in the root of the project

# Todos
1. build out factories for dynamically generating test data - done
2. finish after hooks for emails
3. Add reporting - done
4. Add XRay reporting
5. enable typescript
6. finish hooks for database