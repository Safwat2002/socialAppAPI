import bcrypt from 'bcrypt';
import express from 'express';
import User from '../models/User.js';
import { createError, createToken } from '../utils/Utils.js';

const router = express.Router();


// register (add new User)
router.post("/register", async (req, res, next)=>{

    try{
        // generate hashed Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // create new user using the User Model created by mongoose library
        const user = await new User({
            username:req.body.username,
            email:req.body.email,
            password:hashedPassword,
            fullName:req.body.fullName,
        })

        // save the created user into the database
        await user.save();

        // const {password, isAdmin, ...rest} = user._doc;

        // return the user data as response to the requesting party
        res.status(201).json({message:"User Added Successfully", status:200})

    }catch(err){
        // handling the error
        next(createError(404, err.message));
    }

})


// User Login
router.post("/login", async (req, res, next)=>{
    try{
        
        if(req.body.password == null || req.body.username == null)
            throw createError(400, "Missing Data");
        
        const username = req.body.username;
        const user = await User.findOne({username})
        
        if(!user){
            const err = createError(404, "User Not Found");
            throw err;
        }
        
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        
        if(!validPassword){
            const err = createError(401, "User Or Password Is Incorrect ");
            throw err;
        }
        
        const token = createToken({username:user.username, isAdmin:user.isAdmin });

        const {password,isAdmin, ...rest} = user._doc

        res.cookie("user_login_session", token, {httpOnly: true}).status(202).json(rest);

    }catch(err){
        next(createError(err.statusCode, err.message))
    }
})


// User Logout
router.get("/logout", (req, res, next) => {
    try{
        res.clearCookie("user_login_session")
        res.status(200).json({message:"Logged Out Successfully"})
    }catch(err){
        next(createError(err.statusCode, err.message))
    }
})

export default router;