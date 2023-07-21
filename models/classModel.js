import mongoose from "mongoose";

const classSchema = new mongoose.Schema({
    className:{
        type: String,
        required: true,
    },
    facultyID:{
        type: String,
        required: true,
    }
})

const classModel = mongoose.model('class', classSchema);

export default classModel;