#!/usr/bin/env node
require('dotenv/config');

const mongoose = require('mongoose');
const { createClerkClient } = require('@clerk/express');
const Users = require('../models/Users');
const { classifyLegacyUser, sameEmail } = require('./clerk-migration-lib');

const execute = process.argv.includes('--execute');
const allowDevelopment = process.argv.includes('--allow-development');
const secretKey = process.env.MIGRATION_CLERK_SECRET_KEY;

function stop(message) {
    console.error(message);
    process.exitCode = 1;
}

async function saveLink(user, clerkUserId) {
    const result = await Users.updateOne({ _id: user._id, clerkUserId: { $exists: false },
        email: user.email, password: user.password, emailVerified: true },
        { $set: { clerkUserId } });
    if (result.matchedCount !== 1) {
        throw Object.assign(new Error('Source changed; review before retrying'), { code: 'source_changed' });
    }
}

async function findClerkIdentity(clerk, user) {
    const external = await clerk.users.getUserList({ externalId: [String(user._id)], limit: 2 });
    if (external.data.length) return { kind: 'external', users: external.data };
    const email = await clerk.users.getUserList({ emailAddress: [user.email], limit: 2 });
    return { kind: email.data.length ? 'email' : 'none', users: email.data };
}

async function main() {
    if (!process.env.DB_URI) return stop('DB_URI is required.');
    if (!secretKey) return stop('MIGRATION_CLERK_SECRET_KEY is required. Do not use the normal runtime key for migration.');
    const production = secretKey.startsWith('sk_live_');
    if (!production && !allowDevelopment) {
        return stop('Migration requires a Clerk Production key (sk_live_...). Use --allow-development only for a disposable test.');
    }

    const clerk = createClerkClient({ secretKey });
    const summary = {
        mode: execute ? 'execute' : 'preview', alreadyLinked: 0, ready: 0, created: 0,
        reconciled: 0, conflicts: 0, unverified: 0, unsupportedPassword: 0, errors: 0,
    };
    await mongoose.connect(process.env.DB_URI);
    const cursor = Users.find().select('+password +emailVerified').cursor();
    try {
        for await (const user of cursor) {
            if (user.clerkUserId) { summary.alreadyLinked++; continue; }
            const classification = classifyLegacyUser(user);
            if (classification !== 'ready') { summary[classification]++; continue; }
            try {
                const match = await findClerkIdentity(clerk, user);
                if (match.kind === 'external' && match.users.length === 1 &&
                    sameEmail(match.users[0], user.email)) {
                    if (execute) await saveLink(user, match.users[0].id);
                    summary.reconciled++;
                    continue;
                }
                if (match.kind !== 'none') { summary.conflicts++; continue; }
                summary.ready++;
                if (!execute) continue;
                const identity = await clerk.users.createUser({
                    externalId: String(user._id),
                    emailAddress: [user.email],
                    emailAddressIdentificationStatus: ['verified'],
                    firstName: user.firstName || undefined,
                    lastName: user.lastName || undefined,
                    passwordDigest: user.password,
                    passwordHasher: 'bcrypt',
                });
                await saveLink(user, identity.id);
                summary.created++;
                if (summary.created % 25 === 0) console.log(`Imported and linked ${summary.created} users.`);
            } catch (error) {
                summary.errors++;
                console.error(`User ${user._id}: ${error.errors?.[0]?.code || error.code || error.name || 'migration_error'}`);
            }
        }
    } finally {
        await mongoose.disconnect();
    }
    console.log(JSON.stringify(summary, null, 2));
    if (!execute && summary.ready + summary.reconciled > 0) {
        console.log('Preview only: no MongoDB or Clerk records were changed. Re-run with --execute after reviewing the counts.');
    }
    if (summary.conflicts || summary.errors) process.exitCode = 2;
}

main().catch(error => {
    console.error(error.errors?.[0]?.code || error.code || error.name || 'migration_error');
    process.exitCode = 1;
    mongoose.disconnect().catch(() => {});
});
