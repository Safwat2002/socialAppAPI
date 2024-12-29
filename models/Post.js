import mongoose, { Schema } from "mongoose";

const postScheme = new Schema({
    userId:{
        type:String,
        required:true
    },
    description:{
        type: String,
    },
    img:{
        type:String,
    },
    likes:{
        type:Array,
        default:[]
    },
    loves:{
        type:Array,
        default:[]
    }
}, {timestamps:true})

export default mongoose.model("Post", postScheme);