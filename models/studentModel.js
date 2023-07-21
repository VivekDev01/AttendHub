import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
    userId:{
        type:String,
    },
    name: {
        type: String,
        required: [true, "name is required"]
    },
    studentId:{
        type: String,
        required: [true, "studentId is required"]
    },
    image:{
        type: Buffer,
        required: [true, "image is required"]
    },
    contentType:{
        type: String,
        default: "image/png",
        required: [true, "contentType is required"]
    }
});

const studentModel = mongoose.model('student', studentSchema);

export default studentModel;

