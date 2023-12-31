import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
    classId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    ClassName:{
        type: String,
        required: true
    },
    Date: {
        type: String,
        required: true
    },
    facultyId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    facultyName: {
        type: String,
        required: true
    },
    studentsPresent: {
        type: Array,
        default: []
    },
    studentsAbsent: {
        type: Array,
        default: []
    }
});

const attendanceModel = mongoose.model('attendance', attendanceSchema);

export default attendanceModel;