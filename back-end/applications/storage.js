const { indexes, validator } = require('./definition');
async function prepareApplications(db) {
  const existing = await db.listCollections({ name: 'applications' }).toArray();
  if (!existing.length) await db.createCollection('applications', { validator, validationLevel: 'strict', validationAction: 'error' });
  else await db.command({ collMod: 'applications', validator, validationLevel: 'strict', validationAction: 'error' });
  await db.collection('applications').createIndexes(indexes);
}
module.exports = { prepareApplications };
