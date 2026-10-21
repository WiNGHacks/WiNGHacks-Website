const { test } = require('node:test');
const assert = require('node:assert/strict');
const { createGmailMailer, SEND_SCOPE } = require('../services/gmail');
const env = { EMAIL: 'sender@example.com', GMAIL_CLIENT_ID: 'client', GMAIL_CLIENT_SECRET: 'secret', GMAIL_REFRESH_TOKEN: 'refresh' };
const response = (data, status = 200) => ({ ok: status < 400, status, json: async () => data });
const mail = { to: 'recipient@example.com', subject: 'Verify ✓', html: '<p>Verification link</p>' };

test('refreshes tokens and submits base64url MIME through Gmail API; reuses access token', async () => {
    const calls = [];
    const mailer = createGmailMailer({ env, fetchImpl: async (url, options) => {
        calls.push({ url, options });
        return url.includes('oauth2') ? response({ access_token: 'access', expires_in: 3600, scope: SEND_SCOPE }) : response({ id: 'message' });
    } });
    assert.deepEqual(await mailer.sendMail(mail), { messageId: 'message' });
    await mailer.sendMail(mail);
    assert.equal(calls.length, 3);
    assert.equal(calls[0].options.body.get('grant_type'), 'refresh_token');
    assert.equal(calls[1].options.headers.Authorization, 'Bearer access');
    const raw = JSON.parse(calls[1].options.body).raw;
    assert.match(raw, /^[A-Za-z0-9_-]+$/);
    const mime = Buffer.from(raw, 'base64url').toString();
    assert.match(mime, /From: WiNGHacks Team <sender@example.com>/);
    assert.match(mime, /To: recipient@example.com/);
    assert.match(mime, /Content-Type: text\/html/);
});

test('missing configuration fails before making a network request', async () => {
    const mailer = createGmailMailer({ env: {}, fetchImpl: () => assert.fail('Unexpected network call') });
    await assert.rejects(mailer.sendMail(mail), /Missing EMAIL/);
});

test('OAuth failure does not expose token response secrets', async () => {
    const mailer = createGmailMailer({ env, fetchImpl: async () => response({ error: 'invalid_grant', secret: 'private' }, 400) });
    await assert.rejects(mailer.sendMail(mail), error => error.code === 'GMAIL_OAUTH_FAILED' && !error.message.includes('private'));
});

test('requires send permission', async () => {
    const mailer = createGmailMailer({ env, fetchImpl: async () => response({ access_token: 'access', scope: 'openid' }) });
    await assert.rejects(mailer.sendMail(mail), /permission is missing/);
});

test('supports existing callback routes and reports send errors', async () => {
    const mailer = createGmailMailer({ env, fetchImpl: async url => url.includes('oauth2')
        ? response({ access_token: 'access' }) : response({}, 403) });
    await new Promise(resolve => mailer.sendMail(mail, error => {
        assert.equal(error.code, 'GMAIL_SEND_FAILED');
        assert.equal(error.responseCode, 403);
        resolve();
    }));
});

test('coalesces simultaneous refresh requests', async () => {
    let refreshes = 0;
    const mailer = createGmailMailer({ env, fetchImpl: async url => {
        if (url.includes('oauth2')) { refreshes++; return response({ access_token: 'access' }); }
        return response({ id: 'message' });
    } });
    await Promise.all([mailer.sendMail(mail), mailer.sendMail(mail)]);
    assert.equal(refreshes, 1);
});
