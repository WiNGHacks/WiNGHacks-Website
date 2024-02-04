const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
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
    password: {
        type:String, 
        required: [true, "Please provide a password!"],
        unique: false,
    },
    status: {type:String},
    emailVerified: {type:Boolean},
    emailToken: {type:String}
})

module.exports = mongoose.model('Users', userSchema, 'users')
