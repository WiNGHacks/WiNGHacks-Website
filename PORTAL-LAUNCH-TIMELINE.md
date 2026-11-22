# Hacker Portal Launch Plan

**Target launch: Friday, December 4, 2026**  
**Extra time for urgent fixes: through Monday, December 7**

By launch, hackers should be able to create an account, complete their application, check their status, receive emails, and confirm whether they will attend. Organizers should be able to review applications, send decisions, and see attendance responses.

The form, saved drafts, and organizer review page already exist locally. The remaining work is to test and improve them, finish emails and attendance confirmation, and get everything working on the live site.

On November 19, four frontend tests were failing. All 28 backend tests passed, and the frontend build worked. We need every test to pass before launch, including any new tests we add.

## Stanley — Team setup and launch

Help everyone get started, make the final decisions, and handle the live website.

- [ ] **By Nov 20: share the current code.** Review, commit, and push the application work so everyone starts from the same version. Decide who will review and merge changes.
- [ ] **By Nov 22: give everyone access.** Invite teammates to GitHub, Clerk Development, and MongoDB Development. Check that each person can run the frontend and backend locally. Give live-site access to the people who need it for release.
- [ ] **By Nov 22: share setup instructions.** Explain the three local environment files and share development keys privately. Update the old instructions that still describe the previous login system. Keep secret values out of GitHub.
- [ ] **By Nov 22: approve the form.** Agree on the questions, required fields, answer limits, resume size, permission checkboxes, scoring guidelines, application deadline, and attendance deadline. Share the decisions with Giuliana and Emy.
- [ ] **By Nov 25: check login and email settings.** Check Clerk's live domain settings and the organizer Gmail account. Confirm the backend can send from that account. Clerk sends login and password-reset emails; our backend sends application, decision, and attendance emails.
- [ ] **By Nov 30: check Render settings.** Review the backend's Clerk keys, `DB_URI`, `ALLOWED_ORIGINS`, `FRONT_END_URL`, `APPLICATION_SEASON`, `APPLICATIONS_OPEN`, and `APPLICATION_DEADLINE`. Check the frontend's `REACT_APP_CLERK_PUBLISHABLE_KEY` and `REACT_APP_API_BASE_URL`. Match development keys to the development database and live keys to the live database.
- [ ] **Dec 1–4: deploy and open applications.** Deploy the backend first, then the frontend. Record the deployed version and how to restore the previous version. Check that directly opening or refreshing a portal link works. Coordinate the final team test before opening applications.

**What to hand over:** setup instructions without secrets, approved questions and emails, and a launch checklist.

**Done when:** another teammate can follow the setup guide, the live applicant and organizer tests pass, and the team knows how to restore the previous working version.

## Ivette — Application form and hacker portal

Make sure hackers can fill out the form easily and understand what happens next.

- [ ] **By Nov 22: fix the applicant tests.** Fix the three failing `UserPortal.test.js` cases for the form now inside the portal. Make the tests wait for data to load and fix the React `act` warnings. Keep checks that show whether the page works for users.
- [ ] **By Nov 25: check links to the form.** Make sure logged-in users can reach the portal from the homepage. Update old external-form links where needed. Check that `/apply` and portal links open the correct tab.
- [ ] **By Nov 25: clean up each form step.** Check labels, required-field marks, character counts, errors, Back/Continue buttons, and the review page. Check keyboard navigation. Coordinate question changes with Giuliana so both sides use the same questions.
- [ ] **By Nov 29: test saving and returning later.** Enter answers, refresh, sign out and back in, disconnect the internet, and edit in two tabs. Make sure newer answers are not overwritten. Check that users can recover unsaved answers and understand which copy to keep when edits conflict.
- [ ] **By Nov 29: test resumes and submission.** Try valid PDFs, oversized files, and other file types. Check uploading, removing, and linking a resume. Try missing answers and repeated Submit clicks. Make sure submitted answers remain visible and cannot be edited by the applicant.
- [ ] **By Nov 29: check every status.** Test draft, pending review, accepted, waitlisted, rejected, and reopened applications. Add Emy's attendance form to the portal. Clearly show confirmed or declined attendance.
- [ ] **By Nov 30: test phones and accessibility.** Check phones, tablets, desktop browsers, keyboard-only use, readable errors, and focus when moving between steps. Include screenshots and a short test checklist in the pull request.

**Main files:**

- `front-end/src/components/applications/HackerApplication.js`
- `front-end/src/components/applications/ApplicationFields.js`
- `front-end/src/components/pages/applications/UserPortal.js`
- Related tests and styles

**What to hand over:** applicant fixes, passing tests, screenshots, and a completed test checklist.

**Done when:** a new user can complete the form, return without losing saved answers, submit successfully, and understand their application and attendance status.

## Giuliana — Backend and database

Make sure information is saved correctly, access rules work, and emails can be sent reliably.

- [ ] **By Nov 22: check database setup.** Run the setup preview and check the development database's rules and indexes. Confirm each user can have only one application per season. Review the live setup without automatically adding fake applicants.
- [ ] **By Nov 25: finish the form rules.** Put the approved questions and limits in `definition.js`. Allow incomplete drafts but require complete answers before submission. Check links, agreements, and the signed-in user's identity. Tell the team before changing shared form rules.
- [ ] **By Nov 25: check access and overlapping edits.** Applicants must only see their own information and resumes. Only organizers can review, export, or change decisions. Test two people editing the same application. Keep the application and profile status in sync. Block applicant edits after submission or archiving.
- [ ] **By Nov 25: add email tracking.** Agree with Emy on when emails are sent and what the email buttons need. Save whether an email is waiting, sent, or failed and record send attempts. Prevent repeated requests from sending duplicate emails. A send failure must not lose the application or undo a decision.
- [ ] **By Nov 29: test failed emails and retries.** Test Gmail errors, repeated requests, and retrying failed messages. Make sure waiting emails can still be found and retried after a backend restart. Write down how retries work.
- [ ] **By Nov 29: check attendance saving.** Work with Emy to allow only accepted users to confirm or decline. Save the response against the signed-in account and handle repeated requests. Agree on what happens if the acceptance decision changes. Add deadline checks if required.
- [ ] **By Nov 30: prepare live-site checks.** Document how to check the backend and database, prepare the application collection, make a backup, and restore it. Check which Atlas backup options are available. Keep useful logs without printing secrets.

**Main files:**

- `back-end/routes/Applications.js`
- `back-end/applications/`
- `back-end/scripts/prepare-applications.js`
- `back-end/test/applications.test.js`
- Backend email tracking and related tests

**What to hand over:** backend changes, email endpoint instructions for Emy, passing tests, and backup/retry instructions.

**Done when:** users cannot access someone else's data, repeated requests do not create duplicate results, and failed emails can be retried without losing application or decision information.

## Emy — Organizer page, emails, and attendance

Make sure organizers can review applications and communicate with hackers.

- [ ] **By Nov 22: fix the organizer test.** Fix the failing `AdminApplications.test.js` case. Set up the organizer and data correctly in the test, wait for the list to load, and check that unsaved review edits are preserved.
- [ ] **By Nov 25: test the review page.** Check search, filters, multiple pages, CSV downloads, resumes, notes, scores, and average scores. Test two reviewers editing the same application. Confirm decisions appear correctly in the hacker portal.
- [ ] **By Nov 25: write the emails.** Prepare application-received, accepted, waitlisted, rejected, and attendance-confirmed messages. Include the correct year, portal link, contact email, and deadline. Add plain-text versions and show previews to Stanley.
- [ ] **By Nov 29: connect email buttons.** Use Giuliana's endpoints to send and retry emails. Show whether each message is waiting, sent, or failed. Agree with Stanley on whether decisions send immediately or need a separate Send action. Check that the old SendResults page cannot accidentally send a second copy.
- [ ] **By Nov 29: finish the attendance form.** Confirm questions with Stanley and add missing fields with Giuliana. Let accepted hackers confirm or decline, see their saved response, and see the deadline. Work with Ivette to add it to the portal.
- [ ] **By Nov 29: show attendance to organizers.** Make it easy to find accepted hackers who have not replied, those who confirmed, and those who declined. Provide a list, filter, or download organizers can use for planning.
- [ ] **By Nov 30: test emails and attendance together.** Use team-controlled inboxes. Check formatting, links, duplicate prevention, retries, saved attendance responses, and access restrictions. Write short instructions for the organizers using these features.

**Main files:**

- `front-end/src/components/applications/AdminApplications.js`
- `front-end/src/components/applications/AdminApplications.test.js`
- `front-end/src/components/pages/applications/RSVPForm.js`
- `back-end/routes/RSVP.js`
- Email templates, email service, and related tests

**What to hand over:** organizer, email, and attendance changes, template previews, passing tests, and organizer instructions.

**Done when:** an organizer can review an application, send a decision, check whether the email went through, and see the hacker's attendance response.

## Working together

- Use separate branches and open pull requests for review.
- Stanley approves questions and email wording before they are finalized.
- Giuliana shares email endpoint details by Nov 25 so Emy can connect the buttons.
- Ivette handles `UserPortal.js`; Emy coordinates attendance changes with them.
- Giuliana handles application routes and shared questions. Coordinate changes to those files with them.
- Ivette and Emy check with each other before changing shared styles.
- Include test results, checking instructions, and screenshots with each pull request.
- All tests must pass before launch, including new tests.
- Save badge builders, team applications, 3D maps, and unrelated redesigns for later.

## Schedule

### November 20–22 — Get everyone ready

Stanley shares the code, access, settings, and form decisions. Ivette and Emy fix the frontend tests. Giuliana checks backend tests and database setup. By Nov 22, everyone can work locally, existing tests pass, and questions and dates are agreed on.

### November 23–25 — Finish the missing pieces

Ivette improves the form and portal. Giuliana finishes form rules and email tracking. Emy prepares organizer controls, email templates, and attendance. Stanley reviews progress and resolves shared decisions.

### November 26 — Thanksgiving break

Do not schedule essential work for this day.

### November 27–29 — Test the whole process together

1. Sign up with a `.edu` email and verify it.
2. Sign in and check that a profile is created.
3. Start an application and save answers.
4. Sign out, return, and continue the form.
5. Submit the application.
6. Review it with an organizer account.
7. Accept the applicant and send the email.
8. Open the email and return to the portal.
9. Confirm or decline attendance.
10. Check the response appears for both hacker and organizer.

Also try expired sessions, double-clicking Submit, failed emails, a temporary backend outage, two tabs, mobile browsers, and actions the user does not have permission to perform.

Ivette uses the applicant account, Giuliana watches the backend and database, Emy uses the organizer account, and Stanley records problems and assigns fixes.

### November 30 — Finish development

Merge approved changes, get every test passing, approve emails, and finish setup and support instructions. After this date, focus on problems that would stop people from using the portal.

### December 1–2 — Test on the live website

Keep public applications closed during testing.

- Stanley deploys the backend and frontend and checks live settings.
- Ivette tests the live form with a designated applicant account.
- Giuliana checks the backend, saved records, database setup, and error logs.
- Emy tests organizer review, email delivery, and attendance responses.

Use team-controlled accounts and inboxes. Label test records and clean them up afterward. Check login, `.edu` restrictions, direct page refreshes, saving, submission, review, emails, and attendance confirmation.

### December 3 — Final team check

All four people confirm:

- Forms and organizer pages work on phones and computers.
- Emails arrive, look right, and link to the correct pages.
- Attendance responses are saved and displayed correctly.
- Organizers can review and download the information they need.
- No unresolved errors prevent launch.
- No passwords or secret keys are in GitHub.
- Everyone knows who handles support and how to restore the previous working version.

### December 4 — Open applications

Stanley sets `APPLICATIONS_OPEN=true` and restarts or redeploys the backend if needed. Check that a new user can start and save an application.

- Stanley handles launch decisions and restoring the previous version if needed.
- Ivette watches applicant reports and frontend errors.
- Giuliana watches the backend, database, and Render services.
- Emy watches email delivery, organizer questions, and attendance responses.

Emails and attendance confirmation should be ready at launch. Actual decision emails can be sent later, after organizers review the applications.

### December 5–7 — Extra time for urgent fixes

Use these days to fix launch problems with login, profiles, saving, emails, phone layouts, organizer review, or attendance confirmation.

**Aim to launch December 4. December 7 is the latest date to have everything ready.**
