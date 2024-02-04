const express = require('express')
const router = express.Router()
const Users = require('../models/Users')
const nodemailer = require('nodemailer');
const uuid = require('uuid');

// Hash the password that is received from the users
const bcrypt = require("bcrypt");

// Assign access token to the user
const jwt = require("jsonwebtoken");

router.post('/signup', (req, res) => {
    // let verificationLink
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
                // Generate a unique verification token
                const verificationToken = uuid.v4();

                // create a new user instance and collect the data
                const newUser = new Users({
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email.toLowerCase(),
                    password: hashedPassword,
                    status: req.body.status,
                    emailVerified: 0,
                    emailToken: verificationToken
                });

                /* ================ Email Verification!!! ================ */

                const transporter = nodemailer.createTransport({
                    service: 'Gmail',
                    auth: {
                      user: 'happykiwi127@gmail.com', // Replace with your Gmail email address
                      pass: 'bgyttzzvdtgjvcoo' // Replace with your Gmail password
                    }
                });

                // Generate the verification link
                const verificationLink = `http://localhost:3000/verify/${verificationToken}`;

                const mailOptions = {
                    from: 'happykiwi127@gmail.com',
                    to: req.body.email.toLowerCase(),
                    subject: 'Email Verification',
                    html: `<p>Click <a href="${verificationLink}">here</a> to verify your email.</p>`
                };

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        res.status(500).send({
                            message: "Couldn't send email",
                            error,
                        
                        });
                    } else {
                        res.status(200).send({
                            message: "Successfully sent email",
                        });
                    }
                });

                /* ================ Email Verification!!! ================ */

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
                    id: user._id,
                    userFirstName: user.firstName,
                    userLastName: user.lastName,
                    userEmail: user.email.toLowerCase(),
                    emailToken: user.emailToken,
                },
                "ACCESS-TOKEN",
                { expiresIn: "24h" }
            );

            // return success response
            res.status(200).send({
                message: "Login Successful",
                email: user.email,
                emailVerified: user.emailVerified,
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


/* ================ Email Verification!!! ================ */

router.post("/sendEmail/:token", async (req, res) => {
    const token = req.params.token

    Users.findOne({emailToken: token })
    .then((response) => {
        if(response == null){
            return res.status(404).send({
                message: "Token is not valid",
                response
            });
        }

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
              user: 'happykiwi127@gmail.com', // Replace with your Gmail email address
              pass: process.env.EMAIL_PASSWORD // Replace with your Gmail password
            }
        });

        // Generate the verification link
        const verificationLink = `http://localhost:3000/verify/${token}`;

        const mailOptions = {
            from: 'happykiwi127@gmail.com',
            to: response.email.toLowerCase(),
            subject: 'Email Verification',
            html: `<p>Click <a href="${verificationLink}">here</a> to verify your email.</p>`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                res.status(500).send({
                    message: "Couldn't send email",
                    error,
                
                });
            } else {
                res.status(200).send({
                    message: "Successfully sent email",
                    response
                });
            }
        });
    })
    .catch((e) => {
        res.status(404).send({
            message: "Error with finding verification token",
            e
        });

    })
})

router.put("/verifyEmail/:token", async (req, res) => {
    const token  = req.params.token;

    Users.findOneAndUpdate({ emailToken: token }, {emailVerified: true})
    .then((response) => {
        if(response == null){
            return res.status(404).send({
                message: "Token is not valid",
                response
            });
        }

        //  create JWT token
        const token = jwt.sign(
            {
                id: response._id,
                userFirstName: response.firstName,
                userLastName: response.lastName,
                userEmail: response.email.toLowerCase(),
                emailToken: response.emailToken,
            },
            "ACCESS-TOKEN",
            { expiresIn: "24h" }
        );

        // return success response
        res.status(200).send({
            message: "Email verified",
            token: token,
        });
    })
    .catch((e) => {
        res.status(404).send({
            message: "Couldn't verify email.",
            e
        });

    })

})




/* ================ Email Verification!!! ================ */

router.put("/updateStatus/:id", async (req, res) => {
    var id = req.params.id;
    Users.findOneAndUpdate({_id: id}, {status: req.body.status})
    .then((response) => {
        // return success response
        res.status(200).send({
            message: "User found",
            response
        });
    })
    .catch((e) => {
        res.status(404).send({
            message: "User not found",
        });

    })
})

router.get("/finduser/:id", async (req, res) => {
    var id = req.params.id;
    Users.findOne({ _id: id })
    .then((response) => {
        // return success response
        res.status(200).send({
            message: "User found",
            firstName: response.firstName,
            lastName: response.lastName,
            email: response.email,
            status: response.status
        });
    })
    .catch((e) => {
        res.status(404).send({
            message: "User not found",
        });

    })
})

router.get("/users", async (req, res) => {
	const posts = await Users.find()
	res.send(posts)
})

module.exports = router