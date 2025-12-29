import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    fullName: {
        firstName: {
            type: String,
            required: true,
            minlength: [3, "First name must be at least 3 characters"]
        },
        lastName: {
            type: String,
            minlength: [3, "First name must be at least 3 characters"]
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: [5, "Email must be at least 5 characters only"]
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    socketId:{
        type: String
    }
})

const User = mongoose.model("User", userSchema)
export default User