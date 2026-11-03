const { test } = require('node:test');
const assert = require('node:assert/strict');
const { classifyLegacyUser, sameEmail } = require('../scripts/clerk-migration-lib');

const hash = '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy';

test('migration imports only verified users with valid bcrypt digests', () => {
    assert.equal(classifyLegacyUser({ emailVerified: true, password: hash }), 'ready');
    assert.equal(classifyLegacyUser({ emailVerified: false, password: hash }), 'unverified');
    assert.equal(classifyLegacyUser({ emailVerified: true, password: 'plaintext' }), 'unsupportedPassword');
});

test('Clerk reconciliation requires the same normalized email', () => {
    const identity = { emailAddresses: [{ emailAddress: 'Hacker@Example.com' }] };
    assert.equal(sameEmail(identity, ' hacker@example.com '), true);
    assert.equal(sameEmail(identity, 'other@example.com'), false);
});
