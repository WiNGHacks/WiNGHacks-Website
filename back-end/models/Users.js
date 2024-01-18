const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name: {type:String},
    email: {type:String},
    entryDate: {type:Date, default:Date.now}
})

module.exports = mongoose.model('Users', userSchema, 'users')
