const express = require('express');
const router = express.Router();
const RSVP = require('../models/RSVP');
const Users = require('../models/Users');
const { requireAuth, requireAdmin, requireOwner } = require('../middleware/auth');

const shirtSizes = new Set(['XS', 'S', 'M', 'L', 'XL', 'XXL']);
const decisions = new Set(['yes', 'no']);
const cleanText = (value, max) => typeof value === 'string' ? value.trim().slice(0, max) : '';

function createSubmitRsvp({ rsvps = RSVP, users = Users } = {}) {
    return async (req, res) => {
        try {
        const acceptedRSVP = req.body.acceptedRSVP;
        if (req.user.status !== 'Accepted') {
            return res.status(403).json({ message: 'Only accepted hackers can submit an RSVP.' });
        }
        if (!decisions.has(acceptedRSVP)) {
            return res.status(400).json({ message: 'RSVP decision must be yes or no.' });
        }

        if (acceptedRSVP === 'yes') {
            const phoneNumber = cleanText(req.body.phoneNumber, 40);
            const mealPreference = cleanText(req.body.mealPreference, 500);
            const dietRestriction = cleanText(req.body.dietRestriction, 500);
            const shirtSize = cleanText(req.body.shirtSize, 4);
            if (!phoneNumber || !mealPreference || !shirtSizes.has(shirtSize) ||
                req.body.mlhAccept !== true || req.body.mlhShareData !== true) {
                return res.status(400).json({ message: 'Required RSVP information is incomplete.' });
            }

            // Upsert first so a retry after a partial failure updates the same record
            // instead of failing on the unique userId index.
            await rsvps.findOneAndUpdate(
                { userId: String(req.user._id) },
                { $set: {
                    firstName: req.user.firstName,
                    lastName: req.user.lastName,
                    email: req.user.email,
                    phoneNumber,
                    remindSignedUp: req.body.remindSignedUp === true,
                    mealPreference,
                    dietRestriction,
                    mlhAccept: true,
                    mlhShareData: true,
                    mlhSendEmail: req.body.mlhSendEmail === true,
                    shirtSize,
                } },
                { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true },
            );
        }

        // Recheck status in the write filter in case an administrator changed it
        // while this request was running.
        const profile = await users.findOneAndUpdate(
            { _id: req.user._id, status: 'Accepted' },
            { $set: { acceptedRSVP } },
            { new: true },
        );
        if (!profile) return res.status(409).json({ message: 'Your application status changed. Refresh and try again.' });
        return res.status(200).json({ message: 'RSVP saved.', acceptedRSVP });
        } catch (_error) {
            return res.status(500).json({ message: 'Unable to save your RSVP. Please try again.' });
        }
    };
}

router.post('/submit', requireAuth, createSubmitRsvp());

// Old split-write routes remain authenticated while clients transition, but can
// no longer mutate RSVP data independently.
router.post('/addRsvp', requireAuth, requireOwner, (_req, res) =>
    res.status(410).json({ message: 'Use the RSVP submission endpoint.' }));

router.get('/rsvp', requireAuth, requireAdmin, async (_req, res) => {
    res.send(await RSVP.find());
});

module.exports = router;
module.exports.createSubmitRsvp = createSubmitRsvp;
