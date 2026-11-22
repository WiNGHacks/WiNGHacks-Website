const express = require('express');
const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');
const { createHash } = require('node:crypto');
const { requireAuth, requireAdmin, requirePortalAccess } = require('../middleware/auth');
const { fields, season, statuses, maxResumeBytes, validateAnswers, publicApplication } = require('../applications/definition');
const profileStatus = { pending: 'Applied', in_review: 'Applied', accepted: 'Accepted', waitlisted: 'Waitlisted', rejected: 'Rejected' };
const fail = (status, message, extra = {}) => Object.assign(new Error(message), { status, ...extra });
function createApplicationRouter({ db = () => mongoose.connection.db, authenticate = requireAuth, authorizePortal = requirePortalAccess, authorizeAdmin = requireAdmin, startSession = () => mongoose.connection.startSession() } = {}) {
  const router = express.Router();
  const apps = () => db().collection('applications');
  const wrap = handler => async (req, res) => { try { await handler(req, res); } catch (e) {
    res.status(e.status || 503).json({ message: e.status ? e.message : 'Unable to complete this request. Your saved application is safe; please retry.', ...(e.errors ? { errors: e.errors } : {}), ...(e.current ? { current: e.current } : {}) });
  } };
  router.use(authenticate, authorizePortal, (_req, res, next) => { res.set('Cache-Control', 'no-store'); next(); });
  function open() {
    if (process.env.APPLICATIONS_OPEN === 'false') throw fail(403, 'Applications are currently closed. Your draft is preserved.');
    if (process.env.APPLICATION_DEADLINE) {
      const deadline = Date.parse(process.env.APPLICATION_DEADLINE);
      if (!Number.isFinite(deadline) || Date.now() > deadline) throw fail(403, 'The application deadline has passed. Your draft is preserved.');
    }
  }
  const owner = req => ({ clerkUserId: req.user.clerkUserId, season });
  const idFilter = req => { if (!/^[a-f\d]{24}$/i.test(req.params.id)) throw fail(404, 'Application not found.'); return { _id: new ObjectId(req.params.id), season }; };
  async function current(filter) { const doc = await apps().findOne(filter, { projection: { 'resume.data': 0 } }); if (!doc) throw fail(404, 'Application not found.'); return doc; }
  async function adminApplication(doc) {
    const result = publicApplication(doc, true);
    const ids = [...new Set([
      ...(result.audit || []).map(entry => entry.actor),
      ...(result.reviews || []).map(review => review.reviewer),
    ].filter(Boolean))];
    if (!ids.length) return result;
    const profiles = await db().collection('users').find(
      { clerkUserId: { $in: ids } },
      { projection: { clerkUserId: 1, firstName: 1, lastName: 1, admin: 1 } }
    ).toArray();
    const byId = new Map(profiles.map(profile => [profile.clerkUserId, {
      name: [profile.firstName, profile.lastName].filter(Boolean).join(' ').trim(),
      admin: profile.admin === true,
    }]));
    return {
      ...result,
      audit: (result.audit || []).map(entry => ({ ...entry, actorProfile: byId.get(entry.actor) || null })),
      reviews: (result.reviews || []).map(review => ({ ...review, reviewerProfile: byId.get(review.reviewer) || null })),
    };
  }
  function version(req) { const raw = req.body?.revision ?? req.get('X-Application-Revision'); const v = typeof raw === 'string' && /^\d+$/.test(raw) ? Number(raw) : raw; if (!Number.isSafeInteger(v) || v < 0) throw fail(400, 'A valid revision is required.'); return v; }
  async function conflict(filter, admin) { const doc = await current(filter); throw fail(409, 'This application changed elsewhere. Review the latest version before continuing.', { current: admin ? await adminApplication(doc) : publicApplication(doc) }); }
  async function change(req, filter, set, type, { admin = false, syncProfile = false, extraFilter = {} } = {}) {
    const revision = version(req);
    const update = { $set: { ...set, updatedAt: new Date() }, $inc: { revision: 1 } };
    if (type) update.$push = { audit: { $each: [{ at: new Date(), actor: req.user.clerkUserId, type, reason: String(req.body?.reason || '').slice(0, 1000) }], $slice: -100 } };
    let result;
    const run = async session => {
      result = await apps().findOneAndUpdate({ ...filter, revision, ...extraFilter }, update, { returnDocument: 'after', projection: { 'resume.data': 0 }, ...(session ? { session } : { writeConcern: { w: 'majority', wtimeoutMS: 10000 } }) });
      if (!result) return;
      if (syncProfile) await db().collection('users').updateOne({ _id: result.profileId }, { $set: {
        status: result.deletedAt || result.state === 'draft' ? 'Not Applied' : profileStatus[result.reviewStatus],
        ...(set.state === 'draft' || set.deletedAt || set.reviewStatus && set.reviewStatus !== 'accepted' ? { acceptedRSVP: 'n/a' } : {}),
      } }, { session });
    };
    if (syncProfile) { const session = await startSession(); try { await session.withTransaction(() => run(session), { writeConcern: { w: 'majority' }, readConcern: { level: 'snapshot' } }); } finally { await session.endSession(); } }
    else await run();
    if (!result) await conflict(filter, admin);
    return admin ? adminApplication(result) : publicApplication(result);
  }
  router.get('/config', wrap(async (_req, res) => res.json({ fields, season, statuses, maxResumeBytes, deadline: process.env.APPLICATION_DEADLINE || null, open: process.env.APPLICATIONS_OPEN !== 'false', agreementVersion: '2027-1', codeOfConductUrl: 'https://static.mlh.io/docs/mlh-code-of-conduct.pdf' })));
  router.get('/me', wrap(async (req, res) => res.json(publicApplication(await apps().findOne(owner(req), { projection: { 'resume.data': 0 } })))));
  router.post('/me', wrap(async (req, res) => {
    open(); const filter = owner(req); const now = new Date();
    try { await apps().updateOne(filter, { $setOnInsert: { ...filter, profileId: req.user._id, email: req.user.email,
      answers: { firstName: req.user.firstName || '', lastName: req.user.lastName || '' }, state: 'draft', reviewStatus: 'pending', revision: 0,
      createdAt: now, updatedAt: now, submittedAt: null, deletedAt: null, reviews: [], audit: [], resume: null } }, { upsert: true, writeConcern: { w: 'majority', wtimeoutMS: 10000 } }); } catch (e) { if (e.code !== 11000) throw e; }
    res.json(publicApplication(await current(filter)));
  }));
  router.patch('/me', wrap(async (req, res) => {
    const errors = validateAnswers(req.body.answers); if (Object.keys(errors).length) throw fail(422, 'Check your answers.', { errors });
    res.json(await change(req, owner(req), { answers: req.body.answers }, null, { extraFilter: { state: 'draft', deletedAt: null } }));
  }));
  router.post('/me/submit', wrap(async (req, res) => {
    const doc = await current(owner(req));
    if (doc.state === 'submitted' && !doc.deletedAt) return res.json(publicApplication(doc));
    open(); const errors = validateAnswers(doc.answers, true);
    if (!doc.resume) errors.resume = 'Resume PDF is required.';
    if (Object.keys(errors).length) throw fail(422, 'Complete the required fields before submitting.', { errors });
    res.json(await change(req, owner(req), { state: 'submitted', submittedAt: new Date(), reviewStatus: 'pending', agreementVersion: '2027-1',
      submissionSnapshot: { answers: doc.answers, resume: doc.resume ? { name: doc.resume.name, sha256: doc.resume.sha256 } : null } }, 'submitted', { syncProfile: true, extraFilter: { state: 'draft', deletedAt: null } }));
  }));
  router.put('/me/resume', express.raw({ type: 'application/pdf', limit: maxResumeBytes }), wrap(async (req, res) => {
    if (!Buffer.isBuffer(req.body) || req.body.length < 8 || req.body.length > maxResumeBytes || req.body.subarray(0, 5).toString() !== '%PDF-' || !req.body.subarray(-1024).toString().includes('%%EOF')) throw fail(422, 'Upload a valid PDF, at most 512 KB.');
    const name = String(req.get('X-File-Name') || 'resume.pdf').replace(/[^a-zA-Z0-9._ -]/g, '_').slice(0, 120);
    const resume = { name, size: req.body.length, data: req.body, sha256: createHash('sha256').update(req.body).digest('hex') };
    res.json(await change(req, owner(req), { resume }, 'resume_uploaded', { extraFilter: { state: 'draft', deletedAt: null } }));
  }));
  router.delete('/me/resume', wrap(async (req, res) => res.json(await change(req, owner(req), { resume: null }, 'resume_removed', { extraFilter: { state: 'draft', deletedAt: null } }))));
  async function download(filter, res) {
    const doc = await apps().findOne(filter, { projection: { resume: 1 } }); if (!doc?.resume) throw fail(404, 'Resume not found.');
    res.set({ 'Content-Type': 'application/pdf', 'Content-Disposition': 'attachment; filename="resume.pdf"', 'X-Content-Type-Options': 'nosniff', 'Content-Security-Policy': "default-src 'none'; sandbox" });
    res.send(Buffer.from(doc.resume.data.buffer));
  }
  router.get('/me/resume', wrap(async (req, res) => download(owner(req), res)));
  router.use('/admin', authorizeAdmin);
  function filters(req) {
    const f = { season, deletedAt: null, state: req.query.state === 'draft' ? 'draft' : 'submitted' };
    if (statuses.includes(req.query.status)) f.reviewStatus = req.query.status === 'pending' ? { $in: ['pending', 'in_review'] } : req.query.status;
    if (req.query.q) { const q = String(req.query.q).slice(0, 200).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); f.$or = ['email', 'answers.firstName', 'answers.lastName', 'answers.school'].map(k => ({ [k]: { $regex: q, $options: 'i' } })); }
    return f;
  }
  router.get('/admin', wrap(async (req, res) => {
    const page = Math.max(1, Math.min(10000, Math.floor(Number(req.query.page) || 1)));
    const filter = filters(req); const order = req.query.sort === 'oldest' ? 1 : -1;
    const [items, total] = await Promise.all([apps().find(filter, { projection: { 'resume.data': 0, audit: 0, submissionSnapshot: 0 } }).sort({ submittedAt: order, _id: order }).skip((page - 1) * 25).limit(25).toArray(), apps().countDocuments(filter)]);
    res.json({ items: items.map(d => publicApplication(d, true)), total, page, pageSize: 25 });
  }));
  router.get('/admin/export', wrap(async (req, res) => {
    const docs = await apps().find(filters(req), { projection: { 'resume.data': 0, audit: 0, submissionSnapshot: 0 } }).sort({ submittedAt: 1 }).limit(10000).toArray();
    const cell = v => { let s = String(v ?? ''); if (/^[\s]*[=+@-]/.test(s) || /^[\t\r\n]/.test(s)) s = "'" + s; return '"' + s.replace(/"/g, '""') + '"'; };
    const rows = [['id', 'email', 'state', 'reviewStatus', 'submittedAt', 'resumeName', 'reviews', ...fields.map(f => f.key)], ...docs.map(d => [d._id, d.email, d.state, d.reviewStatus === 'in_review' ? 'pending' : d.reviewStatus, d.submittedAt?.toISOString(), d.resume?.name, JSON.stringify(d.reviews), ...fields.map(f => d.answers[f.key])])];
    res.set({ 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': 'attachment; filename="winghacks-applications.csv"' }).send('\uFEFF' + rows.map(r => r.map(cell).join(',')).join('\r\n'));
  }));
  router.get('/admin/:id', wrap(async (req, res) => res.json(await adminApplication(await current(idFilter(req))))));
  router.get('/admin/:id/resume', wrap(async (req, res) => download(idFilter(req), res)));
  router.patch('/admin/:id', wrap(async (req, res) => {
    const filter = idFilter(req); const doc = await current(filter); const action = req.body.action;
    const reason = req.body.reason;
    if (typeof reason !== 'string' || !reason.trim() || reason.length > 1000) throw fail(422, 'Provide a reason (up to 1000 characters) for the audit trail.');
    let set; let syncProfile = false;
    if (action === 'review') {
      if (doc.state !== 'submitted' || doc.deletedAt) throw fail(409, 'Only active submitted applications can be reviewed.');
      const { score, notes, status } = req.body;
      if (!['accepted', 'waitlisted', 'rejected'].includes(status) || !(score === null || Number.isInteger(score) && score >= 1 && score <= 5) || typeof notes !== 'string' || notes.length > 5000) throw fail(422, 'Choose an acceptance, waitlist, or rejection decision and keep notes under 5000 characters.');
      set = { reviewStatus: status, reviews: [...(doc.reviews || []).filter(r => r.reviewer !== req.user.clerkUserId), { reviewer: req.user.clerkUserId, score, notes, updatedAt: new Date() }] }; syncProfile = true;
    } else if (action === 'edit') {
      if (doc.deletedAt) throw fail(409, 'Restore this application before editing.');
      const preservedAnswers = { ...req.body.answers };
      for (const field of fields.filter(f => f.type === 'checkbox')) {
        if (doc.answers[field.key] === undefined) delete preservedAnswers[field.key];
        else preservedAnswers[field.key] = doc.answers[field.key];
      }
      const errors = validateAnswers(preservedAnswers, doc.state === 'submitted');
      if (Object.keys(errors).length) throw fail(422, 'Check the edited answers.', { errors });
      set = { answers: preservedAnswers, previousAnswers: doc.answers };
    } else if (action === 'reopen') {
      if (doc.deletedAt || doc.state !== 'submitted') throw fail(409, 'Only active submitted applications can be reopened.');
      set = { state: 'draft', reviewStatus: 'pending', submittedAt: null }; syncProfile = true;
    } else throw fail(400, 'Unknown action.');
    res.json(await change(req, filter, set, action, { admin: true, syncProfile }));
  }));
  router.use((error, _req, res, _next) => res.status(error.type === 'entity.too.large' ? 413 : 400).json({ message: error.type === 'entity.too.large' ? 'PDF must be at most 512 KB.' : 'Invalid request.' }));
  return router;
}
module.exports = createApplicationRouter();
module.exports.createApplicationRouter = createApplicationRouter;
