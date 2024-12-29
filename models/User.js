import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username:{
        type:String,
        require: true,
        min:3,
        max:20,
        unique:true
    },
    email:{
        type:String,
        require:true,
        max:80,
        min:10,
        unique:true
    },
    password:{
        type:String,
        require:true,
        min:8
    },
    fullName:{
        type:String,
        default:"Guest"
    },
    profilePicture:{
        type:String,
        default:"",
    },
    profileCover:{
        type:String,
        default:"",
    },
    followers:{
        type:Array,
        default:[]
    },
    followings:{
        type:Array,
        default:[]
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    description:{
        type:String,
        default:"",
        max:50
    },
    city:{
        type:String,
        max:50,
    },
    from:{
        type:String,
        max:50,
    },
    relationship:{
        type:Number,
        enum:[1,2,3] // 1 single , 2 married, 3 other
        
    }
},
{
    timestamps:true
})


export default mongoose.model("User", UserSchema)
