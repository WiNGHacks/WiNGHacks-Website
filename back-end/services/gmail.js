const MailComposer = require('nodemailer/lib/mail-composer');

const SEND_SCOPE = 'https://www.googleapis.com/auth/gmail.send';

function requireSettings(env, keys) {
    for (const key of keys) {
        if (!env[key]) throw new Error(`Missing ${key}. See GMAIL-OAUTH.md.`);
    }
}

// Compatible with the existing promise and callback sendMail call sites.
function createGmailMailer({ env = process.env, fetchImpl = fetch } = {}) {
    let accessToken;
    let expiresAt = 0;
    let refreshing;

    async function getAccessToken() {
        requireSettings(env, ['EMAIL', 'GMAIL_CLIENT_ID', 'GMAIL_CLIENT_SECRET', 'GMAIL_REFRESH_TOKEN']);
        if (accessToken && Date.now() < expiresAt) return accessToken;
        if (!refreshing) {
            refreshing = (async () => {
                const response = await fetchImpl('https://oauth2.googleapis.com/token', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams({
                        client_id: env.GMAIL_CLIENT_ID,
                        client_secret: env.GMAIL_CLIENT_SECRET,
                        refresh_token: env.GMAIL_REFRESH_TOKEN,
                        grant_type: 'refresh_token',
                    }),
                    signal: AbortSignal.timeout(15000),
                });
                const data = await response.json();
                if (!response.ok || !data.access_token) {
                    const error = new Error('Gmail OAuth authorization failed. Run npm run gmail:authorize again.');
                    error.code = 'GMAIL_OAUTH_FAILED';
                    throw error;
                }
                if (data.scope && !data.scope.split(' ').includes(SEND_SCOPE)) {
                    throw new Error('Gmail send permission is missing. Authorize the sender again.');
                }
                accessToken = data.access_token;
                expiresAt = Date.now() + Math.max(0, (Number(data.expires_in) || 3600) - 60) * 1000;
                return accessToken;
            })();
        }
        try { return await refreshing; } finally { refreshing = undefined; }
    }

    async function send(options) {
        const token = await getAccessToken();
        const mime = await new MailComposer({
            ...options,
            from: { name: 'WiNGHacks Team', address: env.EMAIL },
            disableFileAccess: true,
            disableUrlAccess: true,
        }).compile().build();
        const response = await fetchImpl('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ raw: mime.toString('base64url') }),
            signal: AbortSignal.timeout(15000),
        });
        const data = await response.json();
        if (!response.ok) {
            if (response.status === 401) { accessToken = undefined; expiresAt = 0; }
            const error = new Error(`Gmail API could not send email (HTTP ${response.status}).`);
            error.code = 'GMAIL_SEND_FAILED';
            error.responseCode = response.status;
            throw error;
        }
        return { messageId: data.id };
    }

    return {
        sendMail(options, callback) {
            const promise = send(options);
            if (callback) { promise.then(info => callback(null, info), error => callback(error)); return; }
            return promise;
        },
    };
}

module.exports = { createGmailMailer, requireSettings, SEND_SCOPE };
