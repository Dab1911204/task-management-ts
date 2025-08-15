import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    fullName: String,
    email:String,
    password: String,
    tokenUser: String,
    deleted: {
        type: Boolean,
        default: false
    },
    deleteAt: Date,
},
{ timestamps: true }
)
const User = mongoose.model("user", userSchema, "users");

export default User