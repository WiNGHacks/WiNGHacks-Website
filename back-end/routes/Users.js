const express = require('express')
const router = express.Router()
const Users = require('../models/Users')

router.post('/newUser', async(req, res) => {
    const {name, email} = req.body

    const newUser = new Users({
        name: name,
        email: email,
    })
    const saveUser = await newUser.save()
    if (saveUser) {
        res.send("New user is added!")
    }
    res.end()
}) 

router.get("/users", async (req, res) => {
	const posts = await Users.find()
	res.send(posts)
})

module.exports = router