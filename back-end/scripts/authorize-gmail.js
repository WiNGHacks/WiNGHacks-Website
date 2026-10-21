// One-time sender authorization. This script never sends email.
const http = require('node:http');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const envPath = path.resolve(__dirname, '../.env');
require('dotenv').config({ path: envPath });
const { requireSettings, SEND_SCOPE } = require('../services/gmail');

async function main() {
    requireSettings(process.env, ['EMAIL', 'GMAIL_CLIENT_ID', 'GMAIL_CLIENT_SECRET']);
    const redirectUri = 'http://localhost:8082/oauth2/callback';
    const state = crypto.randomBytes(32).toString('hex');
    const verifier = crypto.randomBytes(32).toString('base64url');
    const challenge = crypto.createHash('sha256').update(verifier).digest('base64url');
    let exchanging = false;
    let timer;
    const server = http.createServer(async (req, res) => {
        const url = new URL(req.url, redirectUri);
        if (url.pathname !== '/oauth2/callback') { res.writeHead(404).end(); return; }
        if (url.searchParams.get('state') !== state) { res.writeHead(400).end('Invalid authorization state.'); return; }
        if (exchanging) { res.writeHead(409).end('Authorization already in progress.'); return; }
        exchanging = true;
        try {
            if (url.searchParams.has('error') || !url.searchParams.get('code')) {
                throw new Error('Sender authorization was not granted.');
            }
            const response = await fetch('https://oauth2.googleapis.com/token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                    client_id: process.env.GMAIL_CLIENT_ID,
                    client_secret: process.env.GMAIL_CLIENT_SECRET,
                    code: url.searchParams.get('code'),
                    code_verifier: verifier,
                    redirect_uri: redirectUri,
                    grant_type: 'authorization_code',
                }),
                signal: AbortSignal.timeout(15000),
            });
            const tokens = await response.json();
            if (!response.ok || !tokens.refresh_token || !tokens.scope?.split(' ').includes(SEND_SCOPE)) {
                throw new Error('Google did not return a refresh token with Gmail send permission. Check your OAuth setup and try again.');
            }
            let content = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';
            const value = `GMAIL_REFRESH_TOKEN=${tokens.refresh_token}`;
            content = /^GMAIL_REFRESH_TOKEN=.*$/m.test(content)
                ? content.replace(/^GMAIL_REFRESH_TOKEN=.*$/m, value)
                : content + (content.endsWith('\n') ? '' : '\n') + value + '\n';
            fs.writeFileSync(envPath, content, { mode: 0o600 });
            fs.chmodSync(envPath, 0o600);
            res.setHeader('Content-Type', 'text/plain');
            res.end('Gmail sender authorized. You can close this tab and restart the backend.');
            console.log('Refresh token saved to back-end/.env. Restart the backend.');
        } catch (error) {
            res.writeHead(500).end('Authorization failed. See the terminal.');
            console.error(error.message);
            process.exitCode = 1;
        } finally {
            clearTimeout(timer);
            server.close();
        }
    });
    server.on('error', () => {
        clearTimeout(timer);
        console.error('Could not start the OAuth callback on localhost:8082. Check whether that port is occupied.');
        process.exitCode = 1;
    });
    server.listen(8082, 'localhost', () => {
        const url = new URL('https://accounts.google.com/o/oauth2/v2/auth');
        url.search = new URLSearchParams({
            client_id: process.env.GMAIL_CLIENT_ID, redirect_uri: redirectUri,
            response_type: 'code', scope: SEND_SCOPE, access_type: 'offline',
            prompt: 'consent', state, login_hint: process.env.EMAIL,
            code_challenge: challenge, code_challenge_method: 'S256',
        }).toString();
        console.log('Open this URL and authorize the sender account configured in EMAIL:\n' + url);
        timer = setTimeout(() => {
            console.error('Authorization timed out. Run the script again.');
            process.exitCode = 1;
            server.close();
        }, 5 * 60 * 1000);
    });
}

main().catch(error => { console.error(error.message); process.exitCode = 1; });
