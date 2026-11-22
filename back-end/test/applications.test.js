const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const express = require('express');
const { MongoMemoryReplSet } = require('mongodb-memory-server');
const { MongoClient, ObjectId } = require('mongodb');
const { createApplicationRouter } = require('../routes/Applications');
const { prepareApplications } = require('../applications/storage');
const { fields, season } = require('../applications/definition');
let replica, client, db, server, base;
const user = { _id: new ObjectId(), clerkUserId: 'hacker-test', email: 'hacker@ufl.edu', firstName: 'Test', lastName: 'Hacker', admin: false };
const admin = { _id: new ObjectId(), clerkUserId: 'admin-test', email: 'admin@ufl.edu', admin: true };
before(async () => {
  replica = await MongoMemoryReplSet.create({ replSet: { count: 1 } });
  client = new MongoClient(replica.getUri()); await client.connect(); db = client.db('application_test'); await prepareApplications(db); await db.collection('users').insertMany([{ ...user, status: 'Not Applied' }, { ...admin, firstName: 'Ada', lastName: 'Admin' }]);
  const app = express(); app.use(express.json({ limit: '64kb' }));
  app.use('/applications', createApplicationRouter({ db: () => db, startSession: () => client.startSession(), authenticate: (req,res,next) => {
    if (!req.get('Test-Identity')) return res.status(401).json({});
    req.user = req.get('Test-Identity') === 'admin' ? admin : req.get('Test-Identity') === 'other' ? { ...user, clerkUserId: 'other' } : user; next();
  } }));
  server = app.listen(0); await new Promise(r => server.once('listening',r)); base = `http://127.0.0.1:${server.address().port}/applications`;
});
after(async () => { if (server) await new Promise(r => server.close(r)); await client?.close(); await replica?.stop(); });
async function request(path, method = 'GET', body, identity = 'user', headers = {}) {
  const response = await fetch(base + path, { method, headers: { ...(identity ? { 'Test-Identity': identity } : {}), ...(Buffer.isBuffer(body) ? {} : { 'Content-Type': 'application/json' }), ...headers }, ...(body === undefined ? {} : { body: Buffer.isBuffer(body) ? body : JSON.stringify(body) }) });
  const text = await response.text(); let data; try { data = JSON.parse(text); } catch { data = text; } return { status: response.status, data };
}
function validAnswers() { return Object.fromEntries(fields.map(f => [f.key, f.type === 'checkbox' ? true : f.options ? f.options[0] : f.key === 'graduationYear' ? '2028' : f.type === 'url' ? '' : 'Example answer'])); }
test('complete application lifecycle preserves versions, ownership, and transactional status', async () => {
  assert.equal((await request('/me', 'GET', undefined, '')).status,401);
  assert.equal((await request('/admin')).status,403);
  const starts = await Promise.all([request('/me','POST',{}),request('/me','POST',{})]);
  assert.equal(starts[0].data._id, starts[1].data._id);
  assert.equal(await db.collection('applications').countDocuments(),1);
  let doc = starts[0].data;
  assert.equal((await request('/me/submit','POST',{revision:0})).status,422);
  assert.equal((await request('/me','PATCH',{revision:0,answers:{admin:true}})).status,422);
  const race = await Promise.all(['First','Second'].map(firstName => request('/me','PATCH',{revision:0,answers:{firstName}})));
  assert.deepEqual(race.map(r=>r.status).sort(),[200,409]);
  doc = (await request('/me')).data; assert.equal(doc.revision,1);
  const other = await request('/me','PATCH',{revision:1,answers:{firstName:'Stolen'}},'other'); assert.equal(other.status,404);
  let saved = await request('/me','PATCH',{revision:doc.revision,answers:validAnswers()}); assert.equal(saved.status,200); doc = saved.data;
  const pdf = Buffer.from('%PDF-1.4\nexample resume\n%%EOF');
  const upload = await request('/me/resume','PUT',pdf,'user',{'Content-Type':'application/pdf','X-Application-Revision':String(doc.revision),'X-File-Name':'resume.pdf'});
  assert.equal(upload.status,200); doc = upload.data; assert.equal(doc.resume.size,pdf.length); assert.equal(doc.resume.data,undefined);
  assert.equal((await request('/me/resume')).data,pdf.toString());
  const invalid = await request('/me/resume','PUT',Buffer.from('not a PDF'),'user',{'Content-Type':'application/pdf','X-Application-Revision':String(doc.revision)}); assert.equal(invalid.status,422);
  const submitted = await request('/me/submit','POST',{revision:doc.revision}); assert.equal(submitted.status,200); doc = submitted.data;
  assert.equal((await request('/me/submit','POST',{revision:0})).data.revision,doc.revision);
  assert.equal((await request('/me','PATCH',{revision:doc.revision,answers:validAnswers()})).status,409);
  assert.equal((await db.collection('users').findOne({_id:user._id})).status,'Applied');
  const pendingReopen = await request(`/admin/${doc._id}`,'PATCH',{revision:doc.revision,action:'reopen',reason:'Applicant requested correction before review'},'admin');
  assert.equal(pendingReopen.status,200); doc=pendingReopen.data; assert.equal(doc.state,'draft'); assert.equal(doc.reviewStatus,'pending');
  assert.equal((await db.collection('users').findOne({_id:user._id})).status,'Not Applied');
  const resubmitted = await request('/me/submit','POST',{revision:doc.revision}); assert.equal(resubmitted.status,200); doc=resubmitted.data;
  const review = await request(`/admin/${doc._id}`,'PATCH',{revision:doc.revision,action:'review',status:'accepted',score:5,notes:'Private reviewer note',reason:'Review complete'},'admin'); assert.equal(review.status,200); doc = review.data;
  assert.deepEqual(doc.reviews[0].reviewerProfile,{name:'Ada Admin',admin:true});
  assert.deepEqual(doc.audit.find(entry=>entry.type==='review').actorProfile,{name:'Ada Admin',admin:true});
  assert.equal((await db.collection('users').findOne({_id:user._id})).status,'Accepted');
  assert.equal((await request('/me')).data.reviews,undefined);
  const reopen = await request(`/admin/${doc._id}`,'PATCH',{revision:doc.revision,action:'reopen',reason:'Applicant requested correction'},'admin'); assert.equal(reopen.status,200); assert.equal(reopen.data.state,'draft');
  assert.equal((await db.collection('users').findOne({_id:user._id})).status,'Not Applied');
  await assert.rejects(db.collection('applications').insertOne({season,clerkUserId:'bad'}));
});
test('database rejects duplicates; URLs and CSV are safe; no applicant can set review metadata', async () => {
  let doc=(await request('/me')).data;
  const raw = await db.collection('applications').findOne({_id:new ObjectId(doc._id)}); delete raw._id;
  await assert.rejects(db.collection('applications').insertOne(raw),e=>e.code===11000);
  const answers={...validAnswers(),firstName:'=HYPERLINK("evil")',resumeUrl:'javascript:alert(1)'};
  doc=(await request('/me','PATCH',{revision:doc.revision,answers,reviewStatus:'accepted'})).data;
  assert.equal(doc.reviewStatus,'pending');
  assert.equal((await request('/me/submit','POST',{revision:doc.revision})).status,422);
  const csv=await request('/admin/export?state=draft','GET',undefined,'admin'); assert.equal(csv.status,200); assert.ok(csv.data.includes("'=HYPERLINK"));
  const forbidden=await request(`/admin/${doc._id}`,'GET',undefined,'other'); assert.equal(forbidden.status,403);
});
test('failed profile update rolls back submission, and admin cannot forge applicant consent', async () => {
  let doc=(await request('/me')).data;
  doc=(await request('/me','PATCH',{revision:doc.revision,answers:validAnswers()})).data;
  await db.command({collMod:'users',validator:{status:{$eq:'Not Applied'}},validationLevel:'strict'});
  assert.equal((await request('/me/submit','POST',{revision:doc.revision})).status,503);
  const afterFailure=(await request('/me')).data;assert.equal(afterFailure.revision,doc.revision);assert.equal(afterFailure.state,'draft');
  await db.command({collMod:'users',validator:{}});
  doc=(await request('/me/submit','POST',{revision:doc.revision})).data;
  const edited=await request(`/admin/${doc._id}`,'PATCH',{revision:doc.revision,action:'edit',reason:'Correct name',answers:{...doc.answers,firstName:'Corrected',sponsorConsent:false}},'admin');
  assert.equal(edited.status,200);assert.equal(edited.data.answers.sponsorConsent,true);
  const publicDoc=(await request('/me')).data;assert.equal(publicDoc.previousAnswers,undefined);assert.equal(publicDoc.audit,undefined);
});
test('300 applicant queue remains paginated and searchable without exposing binaries', async () => {
  const template=await db.collection('applications').findOne({clerkUserId:user.clerkUserId});delete template._id;
  await db.collection('applications').insertMany(Array.from({length:300},(_,i)=>({...template,clerkUserId:`load-${i}`,email:`load-${i}@example.edu`,answers:{...template.answers,school:'Scale University'},resume:null})));
  const page=await request('/admin?q=Scale%20University&page=2','GET',undefined,'admin');
  assert.equal(page.status,200);assert.equal(page.data.total,300);assert.equal(page.data.items.length,25);
  const regex=await request('/admin?q=%5B.*','GET',undefined,'admin');assert.equal(regex.status,200);assert.equal(regex.data.total,0);
});
