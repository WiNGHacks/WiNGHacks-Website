require('dotenv/config');
const { MongoClient } = require('mongodb');
const { prepareApplications } = require('../applications/storage');
const { indexes, validator } = require('../applications/definition');
(async () => {
  if (!process.argv.includes('--execute')) { console.log(JSON.stringify({ collection: 'applications', indexes, validator }, null, 2)); return; }
  const client = new MongoClient(process.env.DB_URI);
  try {
    await client.connect();
    const db = client.db();
    const expectedDatabase = process.env.EXPECTED_DB_NAME || 'hackathon_db';
    if (db.databaseName !== expectedDatabase) {
      throw new Error(`Expected ${expectedDatabase}; no changes made.`);
    }
    await prepareApplications(db);
    console.log(JSON.stringify({ database: db.databaseName, collection: 'applications', indexes: await db.collection('applications').indexes(), documents: await db.collection('applications').countDocuments() }));
  } finally { await client.close(); }
})().catch(() => { console.error('Application setup failed; check database connectivity and permissions.'); process.exitCode = 1; });
