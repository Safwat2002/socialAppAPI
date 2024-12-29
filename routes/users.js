import bcrypt from 'bcrypt';
import express from "express";
import User from "../models/User.js";
import {
    createError,
    createHashedPassword,
    verifyUser
} from "../utils/Utils.js";
const router = express.Router();

// update user
router.put("/", verifyUser, async (req, res, next) => {
    try {
        const {
            fullName,
            description,
            city,
            from,
            relationship,
            email,
            password,
            profilePicture,
            profileCover,
        } = req.body;

        let hashed = null;

        if(password){
            hashed = await createHashedPassword(password);
        }

        // update the user which is defined by token
        const user = await User.findOneAndUpdate(
            { username: req.user.username },
            {
                $set: {
                    fullName,
                    description,
                    city,
                    from,
                    relationship,
                    email,
                    profileCover,
                    profilePicture,
                    password: password ? hashed : User.findOne({username:req.user.username}).password,
                },
            },
            { new: true }
        );
        const { password: uPassword, ...rest } = user._doc;
        res.status(200).json(rest);
    } catch (err) {
        next(createError(400, err.message));
    }
})

// delete user
router.delete("/", verifyUser, async (req,res,next) => {
    try{

        const username = req.user.username;
        const user = await User.findOne({username});

        const password = req.body.password;
        
        const valid = await bcrypt.compare(password, user.password);

        if(!valid){
            throw createError(400, "Password Doesn't Match");
        }

        await User.findOneAndDelete({username});

        res.status(200).json({
            message:"user deleted successfully"
        })

    }catch(err){
        next(createError(err.statusCode, err.message));
    }
})

// get Single User data (password not included anyway)
router.get("/:id", async (req, res, next) => {
    try{

        const user = await User.findById(req.params.id);

        if(!user){
            throw createError(400, "User Not Found")
        }

        const {password, updatedAt, isAdmin, ...rest} = user._doc;

        res.status(200).json(rest);

    }catch(err){
        next(createError(err.statusCode, "Something Went Wrong"))
    }
})

// follow a user (the current logged in user which username is hashed inside the token is following a user which id is passed as parameter in the url)
router.put("/:id/follow", verifyUser, async (req, res, next) => {
    try{

        const requestingUser = await User.findOne({username:req.user.username});
        const followedUser = await User.findById(req.params.id);

        if(requestingUser._id.equals(followedUser._id)){
            throw createError(400, "You Can't Follow Yourself")
        }

        if(requestingUser.followings.includes(followedUser._id)){
            throw createError(400, "You Already Following This User")
        }

        await User.findOneAndUpdate({_id: requestingUser._id}, {$push: {followings: followedUser._id.toString()}})
        await User.findOneAndUpdate({_id: followedUser._id}, {$push: {followers: requestingUser._id.toString()}})

        res.status(200).json({message: `You are Following ${followedUser.username}`})

    }catch(err){
        next(createError(err.statusCode, err.message));
    }
})

/**
 * unfollow a user (the current logged in user which username is hashed inside the toke is unfollwing a user which id is passed as parameter in the url)
 * by removing the id from the logged in user following array
 */

router.put("/:id/unfollow", verifyUser, async (req, res, next) => {
    try{

        const requestingUser = await User.findOne({username: req.user.username});
        const unfollowedUser = await User.findById(req.params.id);

        console.log(requestingUser._id.toString())
        console.log(unfollowedUser)

        if(requestingUser._id.equals(unfollowedUser._id)){
            throw createError(400, "you can't unfollow yourself");
        }

        if(!requestingUser.followings.includes(unfollowedUser._id)){
            throw createError(400, "you don't follow the specified user")
        }

        await User.findOneAndUpdate({_id: requestingUser._id}, {$pull:{followings: unfollowedUser._id.toString()}})
        await User.findOneAndUpdate({_id: unfollowedUser._id}, {$pull:{followers: requestingUser._id.toString()}})

        res.status(200).json({message: `You Unfollowed ${unfollowedUser.username}`})

    }catch(err){
        next(createError(err.statusCode, err.message))
    }
})

router.get("/checkUsername/:username", async(req, res, next)=>{
    try{
        const username = await User.findOne({username: req.params.username})

        if(username){
            res.status(200).json({message: "notavailable"})
        }

        res.status(200).json({message:"Available"})
    }catch(err){
        next(createError(400))
    }
})

router.get("/checkEmail/:email", async(req, res, next)=>{
    try{
        const email = await User.findOne({email: req.params.email})

        if(email){
            res.status(200).json({message: "notavailable"})
        }

        res.status(200).json({message:"Available"})
    }catch(err){
        next(createError(400))
    }
})
export default router;