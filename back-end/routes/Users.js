const express = require('express')
const router = express.Router()
const Users = require('../models/Users')
const nodemailer = require('nodemailer');
const uuid = require('uuid');

// Hash the password that is received from the users
const bcrypt = require("bcrypt");

// Assign access token to the user
const jwt = require("jsonwebtoken");

{/* <img src="cid:logo" alt="Banner Picture" style="width: 100%; margin: 0; padding: 0;">   */}
// HTML FOR VERIFY EMAIL TEMPLATE
const emailVerifyTemplate = (verifyLink) => {
    return `
    
    <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
    <p style="color: #f4f4f4; " >. </p>
    <div style="max-width: 600px;  margin: 20px auto;  padding: 20px; background-color: #fff; border-radius: 5px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);">
        <h1 style="color: #333;">Confirm Your Email Address</h1>
        <p style="color: #666; line-height: 1.6;">Thank you for signing up! Please click the button below to verify your email address.</p>
        <a href=${verifyLink}  
            style="display: inline-block; padding: 10px 20px; background-color: #00AFB9; color: #fff; text-decoration: none; border-radius: 3px;"
        >
            Verify Email Address
        </a>
        <p style="color: #666; line-height: 1.6;">
            If you have any question please contact uf.winghacks@gmail.com. Don't forget to follow us on
            <a href="https://www.instagram.com/winghacks/">Instagram</a> and 
            <a href="https://www.linkedin.com/company/winghacks/">LinkedIn</a>!
            for updates!
        </p>
    
    </div>
</body>`
}

const emailWelcomeTemplate = {
    subject: "Your application has been recieved!",
    content: `
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
<p style="color: #f4f4f4; " >. </p>
    <div style="max-width: 600px;  margin: 20px auto;  padding: 20px; background-color: #fff; border-radius: 5px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);">
         
        <h1 style="color: #333;">Thank you for applying to WiNGHacks!</h1>
        <p style="color: #666; line-height: 1.6;">Thank you for applying to hack with us at WiNGHacks! Your application has been received and we will get back to you with a decision after the closing deadline of March 19, 2024.
        </p>
        <p style="color: #666; line-height: 1.6;">
        In the meantime, follow us on
        <a href="https://www.instagram.com/winghacks/">Instagram</a> and 
        <a href="https://www.linkedin.com/company/winghacks/">LinkedIn</a>!
        for updates!
        </p>
    </div>
    <p style="color: #f4f4f4; " >. </p>
</body>
`}

const emailRejectedTemplate = (name) => {
    return{subject: "Thank for your application.",
    content:`
    <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
    <p style="color: #f4f4f4; " >. </p>
        <div style="max-width: 600px;  margin: 20px auto;  padding: 20px; background-color: #fff; border-radius: 5px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);">
              
            <h1 style="color: #333;">Thank you for applying to WiNGHacks!</h1>
            <p style="color: #666; line-height: 1.6;"> Hi ${name} </p>
            <p style="color: #666; line-height: 1.6;">
                Thank you for taking the time to apply to WiNGHacks! Unfortunately, due to limited capacity and a large volume of applicants, we are not able to offer you a spot in this year’s hackathon. We appreciate your interest and highly encourage you to apply again next year!

            </p>
            <p style="color: #666; line-height: 1.6;">Best, <br>WiNGHacks Organizing Team 
            <br>
            <a href="https://www.winghacks.com/">WiNGHacks</a> | 
            <a href="https://www.instagram.com/winghacks/">Instagram</a> | 
            <a href="https://www.linkedin.com/company/winghacks/">LinkedIn</a>
            </p>
            
        </div>
        <p style="color: #f4f4f4; " >. </p>
    </body>
`}
}

const emailAcceptedTemplate = (name) =>  {
    return {subject: "Congratulations!",
    content:`
    <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
    <p style="color: #f4f4f4; " >. </p>
        <div style="max-width: 600px;  margin: 20px auto;  padding: 20px; background-color: #fff; border-radius: 5px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);">
              
            <h1 style="color: #333;">Thank you for applying to WiNGHacks!</h1>
            <p style="color: #666; line-height: 1.6;"> Hi ${name} </p>
            <p style="color: #666; line-height: 1.6;">
                Congratulations – you have been accepted to participate in this year’s WiNGHacks! Confirm your attendance <a href="https://www.winghacks.com/login/">here</a>.
                
                Keep in mind your in-person attendance is expected. You can reply to this email with any questions you have.
            
            
            </p>
            <p style="color: #666; line-height: 1.6;"> We’re so excited to have you! </p>
            <p style="color: #666; line-height: 1.6;">Best, <br>WiNGHacks Organizing Team 
            <br>
            <a href="https://www.winghacks.com/">WiNGHacks</a> | 
            <a href="https://www.instagram.com/winghacks/">Instagram</a> | 
            <a href="https://www.linkedin.com/company/winghacks/">LinkedIn</a>
            </p>
            
        </div>
        <p style="color: #f4f4f4; " >. </p>
    </body>
`}
}

const emailWaitlistedTemplate = (name) => {
    return {subject: "Waitlisted for WiNGHacks Application",
    content:`
    <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
    <p style="color: #f4f4f4; " >. </p>
        <div style="max-width: 600px;  margin: 20px auto;  padding: 20px; background-color: #fff; border-radius: 5px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);">
              
            <h1 style="color: #333;">Thank you for applying to WiNGHacks!</h1>
            <p style="color: #666; line-height: 1.6;"> Hi ${name} </p>
            <p style="color: #666; line-height: 1.6;">
                Thank you for taking the time to apply to WiNGHacks! We were thoroughly impressed with your application; however, due to the volume of applicants to WiNGHacks this year, we have moved your application to waitlisted status. This means that if a spot opens up, we will be able to offer it to you!
             
            </p>
            <p style="color: #666; line-height: 1.6;"> Keep an eye out for emails from us in the upcoming week.</p>
            <p style="color: #666; line-height: 1.6;">Best, <br>WiNGHacks Organizing Team 
            <br>
            <a href="https://www.winghacks.com/">WiNGHacks</a> | 
            <a href="https://www.instagram.com/winghacks/">Instagram</a> | 
            <a href="https://www.linkedin.com/company/winghacks/">LinkedIn</a>
            </p>
            
        </div>
        <p style="color: #f4f4f4; " >. </p>
    </body>
`}
}

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
                    emailToken: verificationToken,
                    admin: false,
                    acceptedRSVP: "n/a"
                });

                /* ================ Email Verification!!! ================ */

                const transporter = nodemailer.createTransport({
                    service: 'Gmail',
                    auth: {
                      user: process.env.EMAIL, // Replace with your Gmail email address
                      pass: process.env.EMAIL_PASSWORD // Replace with your Gmail password
                    }
                });

                // Generate the verification link
                const verificationLink = `${process.env.FRONT_END_URL}verify/${verificationToken}`;

                const mailOptions = {
                    from: `"WiNGHacks Team " ${process.env.EMAIL}`,
                    to: req.body.email.toLowerCase(),
                    subject: 'Confirm your account',
                    html: emailVerifyTemplate(verificationLink),
                    // attachments: [{
                    //     filename: 'WiNGHacks.png',
                    //     path: __dirname + './../pictures/WiNGHacks.png',
                    //     cid: 'logo' // same cid value as in the html img src
                    // }]
                    
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
                    admin: user.admin,
                    acceptedRSVP: user.acceptedRSVP
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

router.post("/sendEmail/status", async (req, res) => {
    const email = req.body.email.toLowerCase()
    const updateStatus = req.body.updateStatus
    const firstName = req.body.firstName
    var emailTemplateSubject;
    var emailTemplateContent;

    // if(updateStatus === "Applied") {
    //     emailTemplateSubject = emailWelcomeTemplate.subject
    //     emailTemplateContent = emailWelcomeTemplate.content
    // }
    if(updateStatus === "Accepted"){
        emailTemplateSubject = emailAcceptedTemplate(firstName).subject
        emailTemplateContent = emailAcceptedTemplate(firstName).content
    }
    else if(updateStatus === "Rejected"){
        emailTemplateSubject = emailRejectedTemplate(firstName).subject
        emailTemplateContent = emailRejectedTemplate(firstName).content
    }
    else if(updateStatus === "Waitlisted"){
        emailTemplateSubject = emailWaitlistedTemplate(firstName).subject
        emailTemplateContent = emailWaitlistedTemplate(firstName).content
    }


    Users.findOne({email: email })
    .then((response) => {
        if(response == null){
            return res.status(404).send({
                message: "Email not found",
                response
            });
        }

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
              user: process.env.EMAIL, // Replace with your Gmail email address
              pass: process.env.EMAIL_PASSWORD // Replace with your Gmail password
            }
        });

        const mailOptions = {
            from: `"WiNGHacks Team " ${process.env.EMAIL}`,
            to: email,
            subject: emailTemplateSubject,
            html: emailTemplateContent,
            // attachments: [{
            //     filename: 'WiNGHacks.png',
            //     path: __dirname + './../pictures/WiNGHacks.png',
            //     cid: 'logo' // same cid value as in the html img src
            // }]
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
            message: "Error sending email",
            e
        });

    })

})

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
              user: process.env.EMAIL, // Replace with your Gmail email address
              pass: process.env.EMAIL_PASSWORD // Replace with your Gmail password
            }
        });

        // Generate the verification link
        const verificationLink = `${process.env.FRONT_END_URL}verify/${token}`;

        const mailOptions = {
            from: `"WiNGHacks Team " ${process.env.EMAIL}`,
            to: response.email.toLowerCase(),
            subject: 'Confirm your account',
            html: emailVerifyTemplate(verificationLink),
            // attachments: [{
            //     filename: 'WiNGHacks.png',
            //     path: __dirname + '../pictures/WiNGHacks.png',
            //     cid: 'logo' // same cid value as in the html img src
            // }]
            
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
                admin: response.admin,
                acceptedRSVP: response.acceptedRSVP
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
        if (response !== null) {

            // var emailTemplateSubject;
            // var emailTemplateContent;

            if(req.body.status === "Applied") {
                emailTemplateSubject = emailWelcomeTemplate.subject
                emailTemplateContent = emailWelcomeTemplate.content
            }
            // else if(req.body.status === "Accepted"){
            //     emailTemplateSubject = emailAcceptedTemplate.subject
            //     emailTemplateContent = emailAcceptedTemplate.content
            // }
            // else if(req.body.status === "Rejected"){
            //     emailTemplateSubject = emailRejectedTemplate.subject
            //     emailTemplateContent = emailRejectedTemplate.content
            // }
            // else if(req.body.status === "Waitlisted"){
            //     emailTemplateSubject = emailWaitlistedTdemplate.subject
            //     emailTemplateContent = emailWaitlistedTdemplate.content
            // }

            const transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                user: process.env.EMAIL, // Replace with your Gmail email address
                pass: process.env.EMAIL_PASSWORD // Replace with your Gmail password
                }
            });

            const mailOptions = {
                from: `"WiNGHacks Team " ${process.env.EMAIL}`,
                to: response.email,
                subject: emailTemplateSubject,
                html: emailTemplateContent,
                // attachments: [{
                //     filename: 'WiNGHacks.png',
                //     path: __dirname + './../pictures/WiNGHacks.png',
                //     cid: 'logo' // same cid value as in the html img src
                // }]
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
            // res.status(200).send({
            //     message: "User found",
            //     response
            // });


        }

        // return success response
       


    })
    .catch((e) => {
        res.status(404).send({
            message: "User not found",
            e
        });

    })
})

router.put("/updateRSVP/:id", async (req, res) => {
    var id = req.params.id;

    Users.findOneAndUpdate({_id: id}, {acceptedRSVP: req.body.acceptedRSVP})
    .then((response) => {
        if (response !== null) {
            res.status(200).send({
                message: "User found",
                response
            });


        }

    })
    .catch((e) => {
        res.status(404).send({
            message: "User not found",
            e
        });

    })
})

router.post("/findUser", async (req, res) => {
    const email = req.body.email;

    Users.findOne({ email: email })
    .then((response) => {
        // return success response
        res.status(200).send({
            message: "User found",
            email: response.email,
            id: response._id
        });
    })
    .catch((e) => {
        res.status(404).send({
            message: "User not found",
        });

    })
})

router.put("/updatePassword/:id", async (req, res) => {
    var id = req.params.id;
    var newPassword = req.body.password;

    Users.findOne({_id: id})
    .then((response) => {
        if (response !== null) {

            bcrypt
            .hash(newPassword, 10)
            .then(async(hashedPassword) => {
                Users.findOneAndUpdate({_id: id}, {password: hashedPassword})
                .then((response) => {
                    if (response!= null) {
                        res.status(200).send({
                            message: "User found",
                            response,
                            password: hashedPassword
                        
                        });
                    }
                })
            })
            // Hash the password 10 times


        }

    })
    .catch((e) => {
        res.status(404).send({
            message: "User not found",
            e
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

router.get("/trigger", async (req, res) => {
	res.send("Trigger to wake up API")
})


module.exports = router