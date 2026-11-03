const express = require('express')
const router = express.Router()
const RSVP = require('../models/RSVP')
const { requireAuth, requireAdmin, requireOwner } = require('../middleware/auth');

router.post('/addRsvp', requireAuth, requireOwner, async(req, res) => {
    const {userId, firstName, lastName, email, phoneNumber, remindSignedUp, mealPreference, dietRestriction, mlhAccept, mlhShareData, mlhSendEmail, shirtSize}  = req.body;
    // let verificationLink
    // create a new user instance and collect the data
    const newRSVP = new RSVP({
        userId: String(req.user._id),
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        email: req.user.email,
        phoneNumber: phoneNumber,
        remindSignedUp: remindSignedUp,
        mealPreference: mealPreference,
        dietRestriction: dietRestriction,
        mlhAccept: mlhAccept,
        mlhShareData: mlhShareData,
        mlhSendEmail: mlhSendEmail,
        shirtSize: shirtSize,
    });

    await newRSVP.save()
        .then((result) => {
        res.status(201).send({
            message: "RSVP Added Successfully",
            result,
        });
    })
    .catch((error) => {
        res.status(500).send({
            message: "Error adding RSVP",
            error,
        });
    });
});

router.get("/rsvp", requireAuth, requireAdmin, async (req, res) => {
	const posts = await RSVP.find()
	res.send(posts)
})

module.exports = router