const { test } = require('node:test');
const assert = require('node:assert/strict');
const { createSubmitRsvp } = require('../routes/RSVP');

const accepted = { _id: '0123456789abcdef01234567', status: 'Accepted', firstName: 'Test', lastName: 'Hacker', email: 'test@ufl.edu' };
function response() {
    return { statusCode: 200, body: null, status(code) { this.statusCode = code; return this; }, json(body) { this.body = body; return this; } };
}
function validBody(overrides = {}) {
    return { acceptedRSVP: 'yes', mealPreference: 'Saturday Lunch',
        dietRestriction: '', shirtSize: 'M', mlhAccept: true, mlhShareData: true, mlhSendEmail: false, ...overrides };
}

test('RSVP submission rejects ineligible users and invalid decisions before database writes', async () => {
    let writes = 0;
    const handler = createSubmitRsvp({ rsvps: { findOneAndUpdate: async () => writes++ }, users: { findOneAndUpdate: async () => writes++ } });
    for (const [user, body, expected] of [
        [{ ...accepted, status: 'Applied' }, validBody(), 403],
        [accepted, validBody({ acceptedRSVP: 'maybe' }), 400],
        [accepted, validBody({ mealPreference: '' }), 400],
        [accepted, validBody({ mlhAccept: false }), 400],
    ]) {
        const res = response();
        await handler({ user, body }, res);
        assert.equal(res.statusCode, expected);
    }
    assert.equal(writes, 0);
});

test('accepted RSVP derives identity from auth and uses an idempotent upsert', async () => {
    const rsvpWrites = [];
    const userWrites = [];
    const handler = createSubmitRsvp({
        rsvps: { findOneAndUpdate: async (...args) => { rsvpWrites.push(args); return {}; } },
        users: { findOneAndUpdate: async (...args) => { userWrites.push(args); return accepted; } },
    });
    const untrusted = validBody({ firstName: 'Forged', email: 'evil@example.com' });
    for (let attempt = 0; attempt < 2; attempt++) {
        const res = response();
        await handler({ user: accepted, body: untrusted }, res);
        assert.equal(res.statusCode, 200);
        assert.equal(res.body.acceptedRSVP, 'yes');
    }
    assert.equal(rsvpWrites.length, 2);
    for (const [filter, update, options] of rsvpWrites) {
        assert.deepEqual(filter, { userId: String(accepted._id) });
        assert.equal(update.$set.firstName, accepted.firstName);
        assert.equal(update.$set.email, accepted.email);
        assert.equal(options.upsert, true);
    }
    assert.deepEqual(userWrites[0][0], { _id: accepted._id, status: 'Accepted' });
});

test('declining updates only the authenticated accepted profile', async () => {
    let rsvpWrites = 0;
    let deleted;
    let userWrite;
    const handler = createSubmitRsvp({ rsvps: { findOneAndUpdate: async () => rsvpWrites++, deleteOne: async filter => { deleted = filter; } },
        users: { findOneAndUpdate: async (...args) => { userWrite = args; return accepted; } } });
    const res = response();
    await handler({ user: accepted, body: { acceptedRSVP: 'no' } }, res);
    assert.equal(res.statusCode, 200);
    assert.equal(rsvpWrites, 0);
    assert.deepEqual(userWrite[1], { $set: { acceptedRSVP: 'no' } });
    assert.deepEqual(deleted, { userId: String(accepted._id) });
});

test('a retry recovers when the profile update fails after the RSVP upsert', async () => {
    let rsvpWrites = 0;
    let userWrites = 0;
    const handler = createSubmitRsvp({
        rsvps: { findOneAndUpdate: async () => { rsvpWrites++; return {}; } },
        users: { findOneAndUpdate: async () => {
            userWrites++;
            if (userWrites === 1) throw new Error('temporary failure');
            return accepted;
        } },
    });
    const first = response();
    await handler({ user: accepted, body: validBody() }, first);
    assert.equal(first.statusCode, 500);
    const retry = response();
    await handler({ user: accepted, body: validBody() }, retry);
    assert.equal(retry.statusCode, 200);
    assert.equal(rsvpWrites, 2);
});

test('database failures return a generic error', async () => {
    const handler = createSubmitRsvp({ rsvps: { findOneAndUpdate: async () => { throw new Error('private details'); } }, users: {} });
    const res = response();
    await handler({ user: accepted, body: validBody() }, res);
    assert.equal(res.statusCode, 500);
    assert.ok(!JSON.stringify(res.body).includes('private details'));
});
