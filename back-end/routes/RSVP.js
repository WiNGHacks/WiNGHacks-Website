const express = require('express')
const router = express.Router()
const RSVP = require('../models/RSVP')

router.post('/addRsvp', async(req, res) => {
    const {userId, email, phoneNumber, remindSignedUp, mealPreference, dietRestriction, merchOptIn, mlhAccept}  = req.body;
    // let verificationLink
    // create a new user instance and collect the data
    const newRSVP = new RSVP({
        userId: userId,
        email: email,
        phoneNumber: phoneNumber,
        remindSignedUp: remindSignedUp,
        mealPreference: mealPreference,
        dietRestriction: dietRestriction,
        merchOptIn: merchOptIn,
        mlhAccept: mlhAccept
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

module.exports = router