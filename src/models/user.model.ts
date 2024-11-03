import mongoose from "mongoose";
const { Schema } = mongoose;

// Schema & Model creation
const userSchema = new Schema({
    _id: String,
    email: String,
    username: String,
    password: String,
});

const User = mongoose.model('User', userSchema);

export default User;