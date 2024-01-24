const express = require('express')
const router = express.Router()
const Users = require('../models/Users')

// Hash the password that is received from the users
const bcrypt = require("bcrypt");

// Assign access token to the user
const jwt = require("jsonwebtoken");

router.post('/signup', (req, res) => {
    Users.findOne({email: req.body.email.toLowerCase()})
    .then((result) =>{
        if (result !== null){
            res.status(409).send({ error: "Email already used" });
        }
        else {
            bcrypt
            // Hash the password 10 times
            .hash(req.body.password, 10)
            .then(async(hashedPassword) => {
                // create a new user instance and collect the data
                const newUser = new Users({
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email.toLowerCase(),
                    password: hashedPassword,
                    status: "Not Applied",
                });
                await newUser.save()
                .then((result) => {
                res.status(201).send({
                    message: "User Created Successfully",
                    result,
                });
                })
                // catch error if the new user wasn't added successfully to the database
                .catch((error) => {
                    res.status(500).send({
                        message: "Error creating user",
                        error,
                    });
                });
            });
        }
    })
});

router.post('/login', (req, res) => {
    Users.findOne({ email: req.body.email.toLowerCase() })
    // if email exists
    .then((user) => {
        // Check if password matches
        bcrypt.compare(req.body.password, user.password)
        // If it doesn't match
        .then((passwordCheck) => {
            if (passwordCheck === false){
                return res.status(400).send({
                    message: "Passwords does not match",
                });
            }

            //  create JWT token
            const token = jwt.sign(
                {
                    userFirstName: user.firstName,
                    userLastName: user.lastName,
                    userEmail: user.email.toLowerCase(),
                },
                "ACCESS-TOKEN",
                { expiresIn: "24h" }
            );

            // return success response
            res.status(200).send({
                message: "Login Successful",
                email: user.email,
                token,
            });
        })

    })
    // catch error if email doesn't exist
    .catch((e) => {
        res.status(404).send({
            message: "Email not found",
        });

    })
});

router.get("/users", async (req, res) => {
	const posts = await Users.find()
	res.send(posts)
})

module.exports = router