// require('dotenv').config({path:"./env"})

import dotenv from "dotenv"
import connectDB from "./db/index.js"
import { app } from "./app.js";
// Load .env file
const result = dotenv.config({path:"./.env"});

// Debug - check what's happening
console.log(" .env load result:", result);
console.log(" MONGODB_URI value:", process.env.MONGODB_URI);
console.log(" PORT value:", process.env.PORT);

if (!process.env.MONGODB_URI) {
    console.error(" MONGODB_URI is not loaded! Check your .env file");
    process.exit(1);
}

connectDB()
    .then(() => {
        app.listen(process.env.PORT || 8000, () => {
            console.log(`Server is running at port ${process.env.PORT}`);
        });
    })
    .catch((err) => {
        console.log("MongoDB connection failed", err);
    });