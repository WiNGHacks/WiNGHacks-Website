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
        required: [true, "Please provide an First Name!"], 
        unique: false,
    },
    lastName: {
        type:String, 
        required: [true, "Please provide an Last Name!"], 
        unique: false,
    },
    email: {
        type:String, 
        required: [true, "Please provide an Email!"], 
        unique: [true, "Email Exist"],
    },
    phoneNumber: {
        type:String, 
    },
    remindSignedUp: {type:Boolean},
    mealPreference: {type:String},
    dietRestriction: {type:String},
    merchOptIn: {type:Boolean},
    mlhAccept: {type:Boolean},
})

module.exports = mongoose.model('RSVP', rsvpSchema, 'rsvp')
