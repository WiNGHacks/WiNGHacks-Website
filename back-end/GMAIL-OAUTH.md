# Gmail API OAuth sender setup

The backend now sends all existing emails through the Gmail API. Nodemailer only
builds MIME messages; Gmail SMTP and EMAIL_PASSWORD are no longer used.
Participants still receive verification links and do not authorize Google access.
Use Node.js 22 (native fetch is required).

1. In https://console.cloud.google.com/, select or create the project for WiNGHacks.
2. Enable **Gmail API** under APIs & Services.
3. Configure Google Auth Platform branding and audience. During external Testing,
   add the sender's Google account as a test user. Add this scope under Data Access:
   `https://www.googleapis.com/auth/gmail.send`.
4. Create an OAuth client with application type **Web application**. Add this exact
   authorized redirect URI: `http://localhost:8082/oauth2/callback`.
5. In `back-end/.env`, retain DB_URI and FRONT_END_URL and set:

   ```env
   EMAIL=your-sender@gmail.com
   GMAIL_CLIENT_ID=your-client-id.apps.googleusercontent.com
   GMAIL_CLIENT_SECRET=your-client-secret
   GMAIL_REFRESH_TOKEN=
   DEV_EMAIL_VERIFICATION=false
   ```

6. From `back-end`, run `npm run gmail:authorize`. Open the printed URL and authorize
   the **same sender account configured in EMAIL**. No email is sent by this script.
   It checks state and PKCE, exchanges the authorization code, and saves the refresh
   token directly into the ignored `.env` file. It does not print credentials.
7. Restart the backend with `npm start`. Restart the frontend if its settings changed:

   ```env
   REACT_APP_SIGNUP_API_URL=http://localhost:8081/users/signup
   REACT_APP_SEND_EMAIL_URL=http://localhost:8081/users/sendEmail/
   REACT_APP_VERIFY_EMAIL_URL=http://localhost:8081/users/verifyEmail/
   ```

8. Sign up with a test account and open the delivered link. For an existing
   unverified account, get its `emailToken` in your development database and open
   `http://localhost:3000/notify/email/TOKEN`, then click Resend Email.

Keep `.env`, the client secret, and refresh token on the backend only. For hosting,
copy the configured values into the host's secret environment settings. Revoke the
old Gmail App Password once the OAuth sender is confirmed working.

External apps in Testing with Gmail access normally have refresh tokens that expire
in seven days. Configure the appropriate production audience/publishing status
before deployment; Google verification requirements depend on the app's audience
and scope usage. Gmail account sending limits still apply. A revoked refresh token
requires rerunning authorization. Failed sends are not automatically retried, to
avoid duplicate delivery when the outcome of a network failure is unknown.

Validation: `npm run test:oauth` uses mocked HTTP calls and sends no real emails.

References:
- https://developers.google.com/workspace/gmail/api/guides/sending
- https://developers.google.com/workspace/gmail/api/auth/scopes
- https://developers.google.com/identity/protocols/oauth2/web-server
- https://developers.google.com/identity/protocols/oauth2#expiration
