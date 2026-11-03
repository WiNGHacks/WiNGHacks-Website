const { test } = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const express = require('express');
const { clerkMiddleware, clerkClient } = require('@clerk/express');
const Users = require('../models/Users');
const { resolveProfile, createRequireAuth, ProfileError } = require('../middleware/auth');
const id = '0123456789abcdef01234567';
const otherId = 'abcdef0123456789abcdef01';
const clerkId = 'user_test_hacker';
const identity = { id: clerkId, firstName: 'Test', lastName: 'Hacker', primaryEmailAddressId: 'email_test',
    emailAddresses: [{ id: 'email_test', emailAddress: 'Hacker@Example.edu', verification: { status: 'verified' } }] };

test('new Clerk identities receive non-admin Mongo profiles with trusted identity fields', async () => {
    let created;
    const profile = await resolveProfile(clerkId, {
        users: { findOne: async () => null, create: async data => { created = data; return { _id: id, ...data }; } },
        getClerkUser: async requested => { assert.equal(requested, clerkId); return identity; },
    });
    assert.equal(profile._id, id);
    assert.deepEqual(created, { clerkUserId: clerkId, firstName: 'Test', lastName: 'Hacker',
        email: 'hacker@example.edu', admin: false, status: 'Not Applied', acceptedRSVP: 'n/a' });
});
test('existing links preserve application data after verifying the current Clerk email', async () => {
    const existing = { _id: id, clerkUserId: clerkId, admin: true, status: 'Accepted' };
    const actual = await resolveProfile(clerkId, { users: { findOne: async () => existing },
        getClerkUser: async () => identity });
    assert.equal(actual, existing);
});
test('never automatically claims a legacy account by email or external ID', async () => {
    await assert.rejects(resolveProfile(clerkId, {
        users: { findOne: async query => query.email ? { _id: id, admin: true } : null, create: async () => assert.fail() },
        getClerkUser: async () => ({ ...identity, externalId: id }),
    }), error => error instanceof ProfileError && error.status === 409);
});
test('unverified or missing primary email cannot create a profile', async () => {
    for (const emailAddresses of [[], [{ ...identity.emailAddresses[0], verification: { status: 'unverified' } }]]) {
        await assert.rejects(resolveProfile(clerkId, {
            users: { findOne: async () => null, create: async () => assert.fail() },
            getClerkUser: async () => ({ ...identity, emailAddresses }),
        }), error => error.status === 403);
    }
});
test('non-edu and deceptive domains cannot provision or reuse a profile', async () => {
    for (const email of ['student@gmail.com', 'student@school.edu.evil.com', 'student@edu', 'student@school.education', 'student@@school.edu']) {
        for (const existing of [null, { _id: id, clerkUserId: clerkId, admin: true }]) {
            await assert.rejects(resolveProfile(clerkId, {
                users: { findOne: async () => existing, create: async () => assert.fail('Must not create profile') },
                getClerkUser: async () => ({ ...identity, emailAddresses: [{ ...identity.emailAddresses[0], emailAddress: email }] }),
            }), error => error.status === 403 && error.code === 'EDU_EMAIL_REQUIRED');
        }
    }
});
test('a verified secondary edu address cannot override an unverified primary address', async () => {
    await assert.rejects(resolveProfile(clerkId, {
        users: { findOne: async () => ({ _id: id }), create: async () => assert.fail() },
        getClerkUser: async () => ({ ...identity, emailAddresses: [
            { ...identity.emailAddresses[0], verification: { status: 'unverified' } },
            { id: 'secondary', emailAddress: 'student@school.edu', verification: { status: 'verified' } },
        ] }),
    }), error => error.code === 'EMAIL_VERIFICATION_REQUIRED');
});
test('school subdomains and uppercase edu domains are accepted', async () => {
    let created;
    await resolveProfile(clerkId, {
        users: { findOne: async () => null, create: async value => { created = value; return value; } },
        getClerkUser: async () => ({ ...identity, emailAddresses: [
            { ...identity.emailAddresses[0], emailAddress: ' Student+Hack@MAIL.UFL.EDU ' },
        ] }),
    });
    assert.equal(created.email, 'student+hack@mail.ufl.edu');
});
test('simultaneous first requests reuse the same profile on a duplicate key', async () => {
    let lookups = 0;
    const existing = { _id: id, clerkUserId: clerkId };
    const profile = await resolveProfile(clerkId, {
        users: { findOne: async () => ++lookups === 3 ? existing : null,
            create: async () => { throw Object.assign(new Error('duplicate'), { code: 11000 }); } },
        getClerkUser: async () => identity,
    });
    assert.equal(profile, existing);
});
test('profile service failures fail closed without leaking details', async () => {
    let status, body;
    const middleware = createRequireAuth({ readAuth: () => ({ userId: clerkId, sessionId: 'sess_test' }),
        getProfile: async () => { throw new Error('private database connection'); } });
    await middleware({}, { status(code) { status = code; return this; }, json(value) { body = value; } }, () => assert.fail());
    assert.equal(status, 503);
    assert.ok(!JSON.stringify(body).includes('private database'));
});
test('legacy credentials are excluded from serialized profiles', () => {
    const profile = new Users({ email: 'test@example.com', password: 'old-hash', emailToken: 'old-token', emailVerified: true });
    assert.equal(profile.toJSON().password, undefined);
    assert.equal(profile.toJSON().emailToken, undefined);
    assert.equal(profile.toJSON().emailVerified, undefined);
});

// Real Clerk signature verification with ephemeral RSA keys. No Clerk account,
// secret, network access to Clerk, or production database is needed for these tests.
test('Clerk HTTP integration protects routes and rejects obsolete authentication', async () => {
    const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', { modulusLength: 2048 });
    const origin = 'http://localhost:3000';
    const issuer = 'https://auth.example.com';
    const makeToken = (claims = {}, signingKey = privateKey) => {
        const now = Math.floor(Date.now() / 1000);
        const header = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT', kid: 'test-key' })).toString('base64url');
        const payload = Buffer.from(JSON.stringify({ iss: issuer, sub: clerkId, sid: 'sess_test', azp: origin,
            iat: now, nbf: now - 5, exp: now + 60, ...claims })).toString('base64url');
        const data = `${header}.${payload}`;
        return `${data}.${crypto.sign('RSA-SHA256', Buffer.from(data), signingKey).toString('base64url')}`;
    };
    let account = new Users({ _id: id, clerkUserId: clerkId, email: 'hacker@example.com', admin: false });
    const originalFindOne = Users.findOne;
    const originalSecret = process.env.CLERK_SECRET_KEY;
    process.env.CLERK_SECRET_KEY = 'sk_test_local_only';
    const originalGetUser = clerkClient.users.getUser;
    clerkClient.users.getUser = async () => identity;
    Users.findOne = async query => query.clerkUserId === clerkId || query._id === id || query.email === 'hacker@example.com' ? account : null;
    const app = express();
    app.use(express.json());
    app.use(clerkMiddleware({
        publishableKey: `pk_test_${Buffer.from('auth.example.com$').toString('base64')}`,
        secretKey: 'sk_test_local_only', jwtKey: publicKey.export({ type: 'spki', format: 'pem' }),
        authorizedParties: [origin],
    }));
    app.use('/users', require('../routes/Users'));
    app.use('/rsvp', require('../routes/RSVP'));
    const server = await new Promise((resolve, reject) => {
        const s = app.listen(0, '127.0.0.1', () => resolve(s)); s.on('error', reject);
    });
    const request = (path, token, method = 'GET', body) => fetch(`http://127.0.0.1:${server.address().port}${path}`, {
        method, redirect: 'manual', headers: { Accept: 'application/json', Origin: origin, 'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}) }, ...(body ? { body: JSON.stringify(body) } : {}),
    });
    try {
        for (const [method, path] of [
            ['GET', '/users/me'], ['POST', '/users/sendEmail/status'], ['PUT', `/users/updateStatus/${id}`],
            ['PUT', `/users/updateRSVP/${id}`], ['POST', '/users/findUser'],
            ['GET', `/users/finduser/${id}`], ['GET', '/users/users'], ['POST', '/rsvp/addRsvp'], ['GET', '/rsvp/rsvp'],
        ]) assert.equal((await request(path, null, method)).status, 401, path);
        for (const token of ['not-a-jwt', makeToken({ exp: 1 }), makeToken({ azp: 'https://evil.example.com' }),
            makeToken({}, crypto.generateKeyPairSync('rsa', { modulusLength: 2048 }).privateKey)]) {
            assert.equal((await request('/users/me', token)).status, 401);
        }
        const token = makeToken({ admin: true }); // Client claims cannot grant app admin rights.
        const me = await request('/users/me', token);
        assert.equal(me.status, 200);
        assert.equal((await me.json())._id, id);
        assert.equal((await request(`/users/finduser/${id}`, token)).status, 200);
        assert.equal((await request(`/users/finduser/${otherId}`, token)).status, 403);
        assert.equal((await request('/users/users', token)).status, 403);
        assert.equal((await request(`/users/updateStatus/${id}`, token, 'PUT', { status: 'Accepted' })).status, 403);
        assert.equal((await request('/rsvp/addRsvp', token, 'POST', { userId: otherId })).status, 403);
        account.admin = true;
        // This route's handler uses findOne, which is stubbed above.
        assert.equal((await request('/users/findUser', token, 'POST', { email: 'hacker@example.com' })).status, 200);
        for (const [method, path] of [['POST', '/users/login'], ['POST', '/users/signup'],
            ['PUT', '/users/verifyEmail/old-token'], ['PUT', `/users/updatePassword/${id}`], ['POST', '/users/sendEmail/old-token']]) {
            assert.equal((await request(path, null, method)).status, 410);
        }
    } finally {
        Users.findOne = originalFindOne;
        clerkClient.users.getUser = originalGetUser;
        if (originalSecret === undefined) delete process.env.CLERK_SECRET_KEY;
        else process.env.CLERK_SECRET_KEY = originalSecret;
        await new Promise(resolve => server.close(resolve));
    }
});
