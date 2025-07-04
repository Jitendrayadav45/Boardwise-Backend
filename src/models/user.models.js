import mongoose from "mongoose"
const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        lowercase: true,
        trim: true,
    },
    email : {
        type : String,
        required : true,
        unique : true,
        trim: true,
    },
    password : {
        type : String,
        required: true,
    },
    profileImage: {
        type: String, // could be a URL or file path
    },
}, {timestamps : true})

export const User = mongoose.model('User', userSchema)