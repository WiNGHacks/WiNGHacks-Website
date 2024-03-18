const express = require('express')
const router = express.Router()
const RSVP = require('../models/RSVP')

router.post('/addRsvp', async(req, res) => {
    const {userId, firstName, lastName, email, phoneNumber, remindSignedUp, mealPreference, dietRestriction, mlhAccept, mlhShareData, mlhSendEmail}  = req.body;
    // let verificationLink
    // create a new user instance and collect the data
    const newRSVP = new RSVP({
        userId: userId,
        firstName: firstName,
        lastName: lastName,
        email: email,
        phoneNumber: phoneNumber,
        remindSignedUp: remindSignedUp,
        mealPreference: mealPreference,
        dietRestriction: dietRestriction,
        mlhAccept: mlhAccept,
        mlhShareData: mlhShareData,
        mlhSendEmail: mlhSendEmail
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

router.get("/rsvp", async (req, res) => {
	const posts = await RSVP.find()
	res.send(posts)
})

module.exports = router