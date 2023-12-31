import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "name is required"]
    },
    email: {
        type: String,
        required: [true, "email is required"]
    },
    password: {
        type: String,
        required: [true, "password is required"]
    },
    confirmPassword: {
        type: String,
        required: [true, "Confirm your password"]
    },
    isStudent: {
        type: Boolean,
        default: false
    },
    studentId: {
        type: String,
        default: ""
    },
    isFaculty: {
        type: Boolean,
        default: false
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    classesJoined:{
        type: Array,
        default: []
    },
    classesCreated:{
        type: Array,
        default: []
    },
});

const userModel = mongoose.model('user', userSchema);

export default userModel;

