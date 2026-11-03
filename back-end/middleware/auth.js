const { getAuth, clerkClient } = require('@clerk/express');
const Users = require('../models/Users');
const { isEduEmail } = require('./eduEmail');

class ProfileError extends Error {
    constructor(status, code, message) {
        super(message);
        this.status = status;
        this.code = code;
    }
}

// The caller must supply an identity already verified by Clerk middleware.
// Never link a legacy account by an email or MongoDB ID supplied by the browser.
async function resolveProfile(clerkUserId, { users = Users, getClerkUser = id => clerkClient.users.getUser(id) } = {}) {
    // Recheck Clerk on every authenticated request so changing the primary
    // address cannot bypass the policy through an existing MongoDB profile.
    const identity = await getClerkUser(clerkUserId);
    if (identity.id !== clerkUserId) throw new Error('Clerk identity mismatch');
    const primaryEmail = identity.emailAddresses.find(email => email.id === identity.primaryEmailAddressId);
    if (primaryEmail?.verification?.status !== 'verified') {
        throw new ProfileError(403, 'EMAIL_VERIFICATION_REQUIRED', 'Please verify your email address.');
    }
    const email = primaryEmail.emailAddress.trim().toLowerCase();
    if (!isEduEmail(email)) {
        throw new ProfileError(403, 'EDU_EMAIL_REQUIRED', 'Please use a verified .edu email address to access WiNGHacks.');
    }
    const existing = await users.findOne({ clerkUserId });
    if (existing) return existing;
    if (await users.findOne({ email })) {
        throw new ProfileError(409, 'PROFILE_LINK_REQUIRED', 'An existing profile needs to be linked. Please contact the WiNGHacks team.');
    }
    try {
        return await users.create({
            clerkUserId,
            firstName: identity.firstName || '',
            lastName: identity.lastName || '',
            email,
            admin: false,
            status: 'Not Applied',
            acceptedRSVP: 'n/a',
        });
    } catch (error) {
        if (error.code !== 11000) throw error;
        // Another request from this same new user may have created the profile.
        const concurrent = await users.findOne({ clerkUserId });
        if (concurrent) return concurrent;
        throw new ProfileError(409, 'PROFILE_LINK_REQUIRED', 'An existing profile needs to be linked. Please contact the WiNGHacks team.');
    }
}

function createRequireAuth({ readAuth = getAuth, getProfile = resolveProfile } = {}) {
    return async (req, res, next) => {
        const { userId, sessionId } = readAuth(req);
        // Session identities only: machine/API-key tokens cannot access hacker data.
        if (!userId || !sessionId) return res.status(401).json({ message: 'Authentication required' });
        try {
            req.user = await getProfile(userId);
            next();
        } catch (error) {
            if (error instanceof ProfileError) {
                return res.status(error.status).json({ code: error.code, message: error.message });
            }
            return res.status(503).json({ message: 'Your profile is temporarily unavailable. Please try again.' });
        }
    };
}

const requireAuth = createRequireAuth();
function requireAdmin(req, res, next) {
    if (req.user.admin !== true) return res.status(403).json({ message: 'Administrator access required' });
    next();
}
function requireOwner(req, res, next) {
    const target = req.params.id || req.body?.userId;
    if (String(req.user._id) !== target) return res.status(403).json({ message: 'Access denied' });
    next();
}

module.exports = { requireAuth, requireAdmin, requireOwner, resolveProfile, createRequireAuth, ProfileError };
