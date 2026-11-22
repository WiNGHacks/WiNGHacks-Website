# [WiNGHacks Website](https://www.winghacks.com/)
WiNGHacks is the University of Florida (UF)'s first hackathon specifically created to uplift Women, Non-binary and Gender-nonconforming students in their technology journey. During the 36 hours of WiNGHacks, 180 hackers will learn new skills, network with their peers, and create innovative projects for a chance to win category prizes.

The goal of our hackathon is to create a welcoming learning and growing environment for underrepresented genders in the tech industry. We hope to remove the barrier of entry to these events for many people, especially first-time hackers, and help them reap the many benefits that hackathons bring.

## Local development

Start the backend and frontend in separate terminals:

```sh
cd back-end
npm run dev
```

```sh
cd front-end
npm start
```

Local startup is fail-closed. It verifies that:

- MongoDB is `hackathon_dev` on `DevCluster`;
- frontend and backend use the same Clerk development instance
  (`pk_test_…` / `sk_test_…`);
- the frontend API URL is `http://localhost:8081`.

If any production setting is selected, `npm run dev` exits before serving the
application. The local backend connection is kept in the ignored
`back-end/.env.development.local` file. Clerk authentication still runs in
Clerk's hosted development instance; “local Clerk” means its test-mode instance,
not a Clerk server running on this computer.

Run only one backend process at a time. If startup reports that port `8081` is
already in use, the backend is already running in another terminal; use that
process or stop it with `Ctrl+C` before starting another.
