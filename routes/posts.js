import express from "express";
import Post from "../models/Post.js";
import User from "../models/User.js";
import { createError, verifyUser } from "../utils/Utils.js";

const router = express.Router();

// create a post

router.post("/", verifyUser, async (req, res, next) => {
    try{

        // the user who call this path
        // is the user who already logged in
        const user = await User.findOne({username: req.user.username});
        
        // get post data from the request body
        const {description, img} = req.body;

        // create post using the post model
        const post = new Post({
            userId: user._id,
            description,
            img
        })

        // save the post into database
        post.save();

        // return the post as response
        res.status(200).json(post)

    }catch(err){
        next(createError(err.statusCode, err.message));
    }
})

// delete a post

router.delete("/:id", verifyUser, async (req, res, next) => {
    try{
        // the requesting user
        const user = await User.findOne({username: req.user.username})

        // the post to be deleted
        const post = await Post.findById(req.params.id);

        // check if the requesting user have privilage to the post
        if(post.userId != user._id){
            throw createError(400, "You Don't Have Access To Delete This Post")
        }

        await Post.findOneAndDelete({_id: post._id});

        res.status(200).json({message: "The Post Has Been Deleted Successfully"})

    }catch(err){
        next(createError(err.statusCode, err.message))
    }
})

// update a post

router.put("/:id", verifyUser, async (req, res, next) => {
    try{
        // the requesting user
        const user = await User.findOne({username: req.user.username})

        // the post to be updated
        const post = await Post.findById(req.params.id);

        // check if the requesting user have privilage to the post
        if(post.userId != user._id){
            throw createError(400, "You Don't Have Access To Update This Post")
        }


        const updatedPost = await Post.findOneAndUpdate({_id: post._id},{$set:{description: req.body.description, img:req.body.img}}, {new: true})

        res.status(200).json(updatedPost);

    }catch(err){
        next(createError(err.statusCode, err.message))
    }
})

// like if a post not liked
// dislike if a post is liked

router.put("/:id/likeDislike", verifyUser, async (req, res, next) => {
    try{
        // the requesting user
        const user = await User.findOne({username: req.user.username})

        // the post to be updated
        const post = await Post.findById(req.params.id);

        // check if the requesting user is already liking the post then dislike
        if(post.likes.includes(user._id.toString())){

            await post.updateOne({_id:post._id}, {$pull:{likes:user._id}})
            res.status(200).json({message:"dislike"});

        }else if(post.loves.includes(user._id.toString())){

            await post.updateOne({_id:post._id}, {$pull:{loves:user._id}, $push:{likes:user._id}})
            res.status(200).json({message:"like"});

        }else{
            await post.updateOne({_id:post._id}, {$push:{likes:user._id}})
            res.status(200).json({message:"like"});
        }
    }catch(err){
        next(createError(err.statusCode, err.message))
    }
})

// love if a post not loved
// unlove if a post is loved

router.put("/:id/loveUnlove", verifyUser, async (req, res, next) => {
    try{
        // the requesting user
        const user = await User.findOne({username: req.user.username})

        // the post to be updated
        const post = await Post.findById(req.params.id);

        // check if the requesting user is already loving or liking the post then unlove
        if(post.loves.includes(user._id.toString())){

            await post.updateOne({_id:post._id}, {$pull:{loves:user._id}})
            res.status(200).json({message:"unlove"});

        }else if(post.likes.includes(user._id.toString())){

            await post.updateOne({_id:post._id}, {$pull:{likes:user._id}, $push:{loves:user._id}})
            res.status(200).json({message:"love"});

        }else{

            await post.updateOne({_id:post._id}, {$push:{loves:user._id}})
            res.status(200).json({message:"love"});
        }

    }catch(err){
        next(createError(err.statusCode, err.message))
    }
})

// get single post

router.get("/:id", async (req, res, next) => {
    try{
        const post = await Post.findById(req.params.id);

        res.status(200).json(post);

    }catch(err){
        next(createError(err.statusCode, err.message))
    }
})

// get timeline posts, for browsing the friends posts
// limit is for the maximum number of posts to be retrieved
router.get("/timeline/all", verifyUser , async (req, res, next)=>{
    try{

        const username = req.user.username;
        const user = await User.findOne({username})

        const posts = await Promise.all(
            user.followings.map((friend)=>{
                return Post.find({userId:friend})
            })
        )

        res.status(200).json(posts);

    }catch(err){
        next(createError(err.statusCode, err.message))
    }
})


// get specific user posts, useful for designing the user profile
// useful for checking a user profile
router.get("/:userId/allPosts", async(req, res, next)=>{
    try{
        const posts = await Post.find({userId:req.params.userId});
        res.status(200).json(posts);

    }catch(err){
        next(createError(err.statusCode, err.message));
    }

})

export default router;