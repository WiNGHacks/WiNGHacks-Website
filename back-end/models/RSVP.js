const mongoose = require('mongoose')


// Email
// Phone number
// Ask them to sign up for REMIND
// Meal preference
// Dietary restrictions
// Opt-in to merch
// MLH Agreement


const rsvpSchema = mongoose.Schema({
    userId: {
        type:String, 
        required: [true, "Please provide an UserId!"], 
        unique: [true, "User Id Exist"],
    },
    firstName: {
        type:String, 
    },
    lastName: {
        type:String, 
    },
    email: {
        type:String, 
    },
    phoneNumber: {
        type:String, 
    },
    remindSignedUp: {type:Boolean},
    mealPreference: {type:String},
    dietRestriction: {type:String},
    mlhAccept: {type:Boolean, required: [true, "Must Agree!"] },
    mlhShareData: {type:Boolean, required: [true, "Must Agree!"]},
    mlhSendEmail: {type:Boolean, },
})

module.exports = mongoose.model('RSVP', rsvpSchema, 'rsvp')
