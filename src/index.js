// require('dotenv').config({path:"./env"})

import dotenv from "dotenv"
import connectDB from "./db/index.js"

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
/*
Approach 1
import mongoose from "mongoose"
import {DB_NAME} from "./constants"
import express from "express"
const app = express()
(async()=>{
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("error",(error)=>{
            console.log("ERROR",error);
            throw error
        })
        app.listen(process.env.PORT,()=>{
            console.log(`App is listening on port ${process.env.PORT}`)
        })

    } catch (error) {
        console.error("ERROR",error);
         throw err
    }
})()
    */