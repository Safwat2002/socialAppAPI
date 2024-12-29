import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import mongoose from 'mongoose';
import authRoute from './routes/auth.js';
import postsRoute from './routes/posts.js';
import userRoute from './routes/users.js';


const app = express();
dotenv.config();


// connect to database
try{
    mongoose.connect(process.env.MONGO_URL)
    console.log("Connected To DB")
}catch(err){
    console.log(err.message)
}

// middleware
app.use(express.json())
app.use(cors())
app.use(cookieParser())
app.use(helmet())
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute)
app.use("/api/posts", postsRoute)

// Error Handling Middleware
app.use((err, req, res, next)=>{

    const status = err.statusCode || 500

    res.status(status).json({
        message:err.message || "Something Went Wrong",
        status
    })
})

// listen to a port
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server Is Up And Running On The Port ${PORT}`);
})