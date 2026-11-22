const path = require('node:path');
const fs = require('node:fs');
const dotenv = require('dotenv');

const backendRoot = path.resolve(__dirname, '..');
const workspaceRoot = path.resolve(backendRoot, '..');
const baseEnvPath = path.join(backendRoot, '.env');
const localEnvPath = path.join(backendRoot, '.env.development.local');
const frontendEnvPath = path.join(workspaceRoot, 'front-end', '.env.local');

function stop(message) {
  console.error(`Local startup blocked: ${message}`);
  process.exit(1);
}

for (const file of [baseEnvPath, localEnvPath, frontendEnvPath]) {
  if (!fs.existsSync(file)) stop(`missing ${path.relative(workspaceRoot, file)}`);
}

// Load shared local services and Clerk development credentials first, then
// replace only environment-specific values such as DB_URI with the dev overlay.
dotenv.config({ path: baseEnvPath });
dotenv.config({ path: localEnvPath, override: true });
const frontendEnv = dotenv.parse(fs.readFileSync(frontendEnvPath));

let databaseUrl;
try {
  databaseUrl = new URL(process.env.DB_URI);
} catch {
  stop('DB_URI in .env.development.local is invalid');
}

const databaseName = databaseUrl.pathname.replace(/^\//, '');
if (process.env.EXPECTED_DB_NAME !== 'hackathon_dev' || databaseName !== 'hackathon_dev') {
  stop('the selected MongoDB database must be hackathon_dev');
}
if (!process.env.EXPECTED_DB_HOST || databaseUrl.hostname !== process.env.EXPECTED_DB_HOST) {
  stop('the selected MongoDB host does not match EXPECTED_DB_HOST');
}
if (!process.env.CLERK_PUBLISHABLE_KEY?.startsWith('pk_test_')) {
  stop('CLERK_PUBLISHABLE_KEY must belong to a Clerk development instance');
}
if (!process.env.CLERK_SECRET_KEY?.startsWith('sk_test_')) {
  stop('CLERK_SECRET_KEY must belong to a Clerk development instance');
}
if (frontendEnv.REACT_APP_CLERK_PUBLISHABLE_KEY !== process.env.CLERK_PUBLISHABLE_KEY) {
  stop('frontend and backend Clerk publishable keys must use the same development instance');
}
if (!/^http:\/\/(localhost|127\.0\.0\.1):8081\/?$/.test(frontendEnv.REACT_APP_API_BASE_URL || '')) {
  stop('frontend REACT_APP_API_BASE_URL must point to the local backend on port 8081');
}

process.env.NODE_ENV = 'development';
process.env.LOCAL_DEVELOPMENT = 'true';

console.log(`Local environment verified: Clerk development instance + ${databaseName} on ${databaseUrl.hostname}`);
if (process.argv.includes('--check')) process.exit(0);
require('../index');
