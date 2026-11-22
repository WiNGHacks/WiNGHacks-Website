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
app.use(express.json({ limit: '64kb' }))

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

app.use('/applications', require('./routes/Applications'));

// Connecting to MongoDB 
const mongoose = require('mongoose')
require('dotenv/config') // Env To get the DB URI

mongoose.connect(process.env.DB_URI)
    .then(async () => {
        // Ensure unique Clerk IDs before accepting profile creation requests.
        await require('./models/Users').init();
        const applicationIndexes = await mongoose.connection.db.collection('applications').indexes();
        if (!applicationIndexes.some(index => index.name === 'one_application_per_user_season' && index.unique)) throw new Error('Run prepare-applications first.');
        console.log(`DB Connected (${mongoose.connection.db.databaseName})!`);
        const server = app.listen(port, () => console.log(`Server is running on port ${port}`));
        server.on('error', async (error) => {
            if (error.code === 'EADDRINUSE') {
                console.error(`Port ${port} is already in use. The local backend may already be running.`);
            } else {
                console.error('The backend server could not start.');
            }
            await mongoose.disconnect().catch(() => {});
            process.exit(1);
        });
    })
    .catch(() => { console.error('Database initialization failed. Check MongoDB settings and indexes.'); process.exit(1); });
