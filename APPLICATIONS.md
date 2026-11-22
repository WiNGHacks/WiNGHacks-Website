# Hacker applications

Applicant route: `/apply`. Organizer route: `/admin/applications`, restricted by Clerk sessions and the existing MongoDB profile `admin: true`. No accounts are promoted by this change. The portal links both routes for eligible users.

## Database change

The only new collection is `hackathon_db.applications`. `users` and `rsvp` are retained. Each application has a unique `(season, clerkUserId)` index, structured validated answers, trusted profile ID/email, revision, state, dates, review status, reviewer notes/scores, consent version, last submission snapshot, previous admin-edited answers, and the latest 100 audit events. A second index supports the review queue. Applicant responses exclude internal reviews, audit events, prior answers, and submission snapshots.

Review notes are per reviewer. Applications become pending automatically when submitted; organizers choose only accepted, waitlisted, or rejected. Admin updates require a reason and the current revision. Applicant consent is never editable by administrators. Reopen is available before or after a decision, resets the application to a draft, and requires a fresh submission. The review portal does not delete applications or send email automatically. Decisions are visible immediately in the portal.

PDF resumes are optional, max 512 KiB, stored as binary within the application for atomic attachment changes without orphan files. About 300 maximum-size PDFs consume 150 MiB before database overhead. List/detail endpoints exclude binary. Downloads require owner/admin authorization, use attachment disposition, and disable sniffing. Basic PDF signature/EOF validation is not malware scanning; files must be treated as untrusted by reviewers. Resume links are an alternative. No PDFs are stored on Render's ephemeral filesystem.

## Data preservation

Answers back up synchronously to localStorage on each edit, scoped to Clerk user, season, and editor instance. Cloud saves debounce at 800 ms with a five-second retry loop and online/visibility triggers. Every save carries a revision; MongoDB compare-and-set prevents stale writes. Nonoverlapping changes merge; conflicting fields require an explicit choice. In-flight responses never replace newer typing. Refresh/reopen offers recovery copies; a saved backup is removed only after confirmation. Storage failures are visible, downloads provide a manual backup, and pending work triggers a browser leave warning. Browser backups expire after 24 hours, are removed after submission, and are cleared for that account on sign-out. They remain sensitive local data while present; clearing site storage loses unsynced work. No browser can guarantee saving during power loss or storage failure.

Submission and uploads wait for outstanding text saves. Submitted applications reject applicant edits on the server until an organizer reopens them. Submission retries are idempotent. Application decisions and the legacy profile status update in one MongoDB transaction. Resume uploads are not backed up locally: the user must see confirmation before leaving. Existing managed applications cannot use the legacy status-update endpoint.

## Setup and deployment

1. Run `cd back-end && npm ci`.
2. Inspect `npm run applications:preview`. It displays collection validation and indexes without connecting.
3. Run `npm run applications:prepare` with the intended `DB_URI` and `EXPECTED_DB_NAME`. Production defaults to `hackathon_db`; local development pins `hackathon_dev`. The script creates/validates `applications` and its indexes without inserting application records. It is idempotent. The Atlas plugin cannot express the required unique index/collection validator, so this script uses the installed MongoDB driver.
4. Backend environment: existing Clerk keys/origin settings plus `APPLICATION_SEASON` (default `2027`), `APPLICATIONS_OPEN` (default true), and optional `APPLICATION_DEADLINE` (ISO timestamp with timezone). Saving an existing draft remains possible after closing; new drafts and final submission do not.
5. Deploy the backend, then frontend using the existing Render services. Backend startup verifies the unique application index. Frontend retains `REACT_APP_API_BASE_URL`; the external form URL is no longer used.
6. Verify with a designated test account on the deployed frontend, including token expiry, save/reload, submit, and organizer review. Never seed test applicants into production automatically.

## Opening applications in production

Use this checklist when the public application period begins. These values belong in the two existing Render services; never commit their secret values.

### 1. Update the Render backend service

```env
PORTAL_ADMIN_ONLY=false
APPLICATIONS_OPEN=true
APPLICATION_SEASON=2027
APPLICATION_DEADLINE=<ISO timestamp with timezone, or blank for no deadline>
```

Keep the production `DB_URI`, live Clerk keys, `FRONT_END_URL=https://winghacks.com`, and `ALLOWED_ORIGINS=https://winghacks.com` unchanged. Deploy the backend first and confirm its logs show `DB Connected (hackathon_db)!` and that the server is listening.

### 2. Update the Render frontend service

```env
REACT_APP_PORTAL_ADMIN_ONLY=false
```

Keep `REACT_APP_API_BASE_URL=https://winghacks-backend.onrender.com` and the live Clerk publishable key unchanged. Clear the frontend build cache and deploy because `REACT_APP_*` values are compiled into the build.

### 3. Verify before announcing

- Sign up with a non-admin `.edu` account and verify its email.
- Confirm the account can open `/portal`, create a draft, save, refresh, upload a PDF resume, and submit.
- Confirm the submitted application is locked and shows Pending review.
- Confirm a non-admin cannot open the Review tab or call `/applications/admin`.
- Confirm an `admin: true` account can review the submission and choose Accepted, Waitlisted, or Rejected.
- Confirm the Reopen action works without first selecting a decision.

### Pause or roll back access

To return to the private team preview, set both `PORTAL_ADMIN_ONLY` and `REACT_APP_PORTAL_ADMIN_ONLY` to `true`, then redeploy backend first and frontend second. To keep the portal visible but stop new drafts and submissions, leave both portal variables `false`, set `APPLICATIONS_OPEN=false`, and redeploy only the backend. Existing drafts remain stored.

The current scale uses 25-item server pagination and escaped search across names, email, and school. CSV exports honor active filters and neutralize spreadsheet formula prefixes. Bulk decisions are deliberately handled per applicant with a reason. No hard cap at 300 blocks legitimate extra applicants.

## Validation

`cd back-end && npm test` runs an ephemeral replica set for application integration tests; it never uses `DB_URI`. Tests cover ownership/admin gates, duplicate creation, concurrent save conflicts, validation, binary resumes, submission retries/locks, transactional profile decisions, reopening before and after a decision, and CSV escaping.

`cd front-end && CI=true npm test -- --watchAll=false --runInBand` tests draft merge, failures, serialization, storage warnings, locked recovery, and existing auth/portal behavior. `npm run build` verifies production compilation.

## Applied in this workspace — November 14, 2026

The setup script was executed against `cluster0.drbx8ej.mongodb.net/hackathon_db`. `applications` was created with strict validation and both declared indexes, including the unique user/season index. Read-only Atlas verification found zero applications, one existing user, and 169 existing RSVP records. No applicant data or existing profile/RSVP records were changed during setup.

Validation completed: 28 backend tests, 53 frontend tests, and the production frontend build. The build still reports existing warnings in legacy Header, Footer, Attendance, and SendResults components. A local browser preview using fictional data verified the form layout, step navigation, save status, and organizer queue. Render deployment and a real deployed Clerk session were not exercised. Deploy backend and frontend to make the new routes live.

## MongoDB environments

- Production: Atlas project `WiNGHacks Production`, cluster `Cluster0`, database `hackathon_db`.
- Development: Atlas project `WiNGHacks Development`, cluster `DevCluster`, database `hackathon_dev`.

The development project has its own database user, restricted to `readWrite` on
`hackathon_dev` and scoped to `DevCluster`. Its connection URI is stored in
the ignored local file `back-end/.env.development.local`; never copy that file
into source control. Only the development workstation's current public IP is on
the dev project's access list. If that IP changes, replace the Atlas access-list
entry before connecting.

The dev database starts empty with `users`, `rsvp`, and `applications`
collections. Its application validator and indexes match production. To prepare
or recheck it locally:

```sh
cd back-end
DOTENV_CONFIG_PATH=.env.development.local node -r dotenv/config scripts/prepare-applications.js --execute
```

The existing production cluster name cannot be renamed in Atlas, so the project
names are the environment labels. The production connection string and database
were not changed.

Normal local startup now selects these settings automatically:

```sh
cd back-end && npm run dev
cd front-end && npm start
```

The backend's local launcher loads `back-end/.env` for the Clerk development
keys, then overrides the database with `back-end/.env.development.local`. Both
launchers stop before serving if MongoDB is not `hackathon_dev`, either Clerk
key is not test-mode, the frontend/backend Clerk instances differ, or the
frontend API does not point to localhost. Render can use the conventional
`npm start` command (or `npm run render-start`) with its service environment variables.
