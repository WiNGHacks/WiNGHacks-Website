require('dotenv/config');
const { clerkMiddleware } = require('@clerk/express');
for (const key of ['CLERK_PUBLISHABLE_KEY', 'CLERK_SECRET_KEY']) {
    if (!process.env[key]) throw new Error(`${key} is required.`);
}
// Set up Express
const express = require('express');
const port = process.env.PORT || 8081; // Change this to your desired port
const app = express();

// To read JSON body
app.use(express.json())

// CORS
const cors = require("cors");
const corsOptions = {
    origin: (process.env.ALLOWED_ORIGINS || process.env.FRONT_END_URL || 'http://localhost:3000').split(',').map(value => new URL(value.trim()).origin),
    credentials: false,
    optionsSuccessStatus: 200
}
app.use(cors(corsOptions));
app.use(clerkMiddleware({ authorizedParties: corsOptions.origin }));

// Routers
const usersRouter = require("./routes/Users")
app.use("/users", usersRouter)

const rsvpRouter = require("./routes/RSVP")
app.use("/rsvp", rsvpRouter)

// Connecting to MongoDB 
const mongoose = require('mongoose')
require('dotenv/config') // Env To get the DB URI

const dbOptions = { useNewUrlParser: true, useUnifiedTopology: true }
mongoose.connect(process.env.DB_URI, dbOptions)
    .then(async () => {
        // Ensure unique Clerk IDs before accepting profile creation requests.
        await require('./models/Users').init();
        console.log('DB Connected!');
        app.listen(port, () => console.log(`Server is running on port ${port}`));
    })
    .catch(() => { console.error('Database initialization failed. Check MongoDB settings and indexes.'); process.exit(1); });
