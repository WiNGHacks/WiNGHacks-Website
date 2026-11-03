const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    // Sparse allows legacy records to remain unlinked until a deliberate migration.
    clerkUserId: { type: String, unique: true, sparse: true },
    firstName: { type: String, default: '' },
    lastName: { type: String, default: '' },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    status: { type: String, default: 'Not Applied' },
    admin: { type: Boolean, default: false },
    acceptedRSVP: { type: String, default: 'n/a' },
    // Legacy data is retained for a separate migration; never read for authentication.
    password: { type: String, select: false },
    emailToken: { type: String, select: false },
    emailVerified: { type: Boolean, select: false },
});
userSchema.set('toJSON', { transform: (_doc, value) => {
    delete value.password;
    delete value.emailToken;
    delete value.emailVerified;
    return value;
} });

module.exports = mongoose.model('Users', userSchema, 'users');
