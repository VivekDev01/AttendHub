import mongoose from "mongoose";

const { Schema, Types } = mongoose;
const classSchema = new Schema({
    className:{
        type: String,
        required: true,
    },
    facultyId:{
        type: Types.ObjectId, // Use Types.ObjectId instead of objectId
        required: true,
    },
    facultyName:{
        type: String,
        required: true,
    },
    studentsJoined:{
        type: Array,
        default: [],
    },
    attendances:{
        type: Array,
        default: [],
    }
});

const classModel = mongoose.model('class', classSchema);

export default classModel;
