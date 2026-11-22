const path = require('node:path');
const fs = require('node:fs');
const dotenv = require('dotenv');

const frontendRoot = path.resolve(__dirname, '..');
const workspaceRoot = path.resolve(frontendRoot, '..');
const frontendPath = path.join(frontendRoot, '.env.local');
const backendPath = path.join(workspaceRoot, 'back-end', '.env');
const databasePath = path.join(workspaceRoot, 'back-end', '.env.development.local');

function stop(message) {
  console.error(`Local startup blocked: ${message}`);
  process.exit(1);
}
function read(file) {
  if (!fs.existsSync(file)) stop(`missing ${path.relative(workspaceRoot, file)}`);
  return dotenv.parse(fs.readFileSync(file));
}

const frontend = read(frontendPath);
const backend = read(backendPath);
const database = read(databasePath);
// React Scripts preserves values already exported by the shell, so validate
// those effective values rather than trusting the file alone.
const effectivePublishableKey =
  process.env.REACT_APP_CLERK_PUBLISHABLE_KEY || frontend.REACT_APP_CLERK_PUBLISHABLE_KEY;
const effectiveApiBaseUrl =
  process.env.REACT_APP_API_BASE_URL || frontend.REACT_APP_API_BASE_URL;

if (!effectivePublishableKey?.startsWith('pk_test_')) {
  stop('frontend Clerk key must belong to a development instance');
}
if (effectivePublishableKey !== backend.CLERK_PUBLISHABLE_KEY) {
  stop('frontend and backend must use the same Clerk development instance');
}
if (!backend.CLERK_SECRET_KEY?.startsWith('sk_test_')) {
  stop('backend Clerk secret must belong to a development instance');
}
if (!/^http:\/\/(localhost|127\.0\.0\.1):8081\/?$/.test(effectiveApiBaseUrl || '')) {
  stop('REACT_APP_API_BASE_URL must point to the local backend on port 8081');
}

let databaseUrl;
try {
  databaseUrl = new URL(database.DB_URI);
} catch {
  stop('development DB_URI is invalid');
}
if (databaseUrl.pathname.replace(/^\//, '') !== 'hackathon_dev' ||
    database.EXPECTED_DB_NAME !== 'hackathon_dev' ||
    !database.EXPECTED_DB_HOST ||
    databaseUrl.hostname !== database.EXPECTED_DB_HOST) {
  stop('backend local overlay must select the verified hackathon_dev database');
}

console.log('Local environment verified: frontend uses local API, Clerk development, and hackathon_dev');
