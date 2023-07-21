import mongoose from "mongoose";

const classSchema = new mongoose.Schema({
    className:{
        type: String,
        required: true,
    },
    facultyId:{
        type: String,
        required: true,
    }
})

const classModel = mongoose.model('class', classSchema);

export default classModel;