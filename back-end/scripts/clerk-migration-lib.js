const BCRYPT_DIGEST = /^\$2[aby]\$(0[4-9]|[12]\d|3[01])\$[./A-Za-z0-9]{53}$/;

function classifyLegacyUser(user) {
    if (user.emailVerified !== true) return 'unverified';
    if (typeof user.password !== 'string' || !BCRYPT_DIGEST.test(user.password)) return 'unsupportedPassword';
    return 'ready';
}

function sameEmail(clerkUser, email) {
    const normalized = String(email).trim().toLowerCase();
    return clerkUser.emailAddresses?.some(address => address.emailAddress.trim().toLowerCase() === normalized) || false;
}

module.exports = { BCRYPT_DIGEST, classifyLegacyUser, sameEmail };
