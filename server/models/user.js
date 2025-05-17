import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        minlength: 3
    },
    profilePic: {
        type: String,
        required: false
    },
    otp: {
        type: String,
        required: false,
    }
}, { timestamps: true })

///////////////////////////////// name of collection : user
const UserModel = mongoose.model("user", userSchema)
export default UserModel
