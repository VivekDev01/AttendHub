import userModel from "../models/userModel.js"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import studentModel from "../models/studentModel.js";
import classModel from "../models/classModel.js";
import mongoose from "mongoose";
import attendanceModel from "../models/attendanceModel.js";

//register callback
const registerController = async (req, res) => {
    try {
        const existingUser = await userModel.findOne({ email: req.body.email })
        if (existingUser) {
            return res.status(200).send({ message: 'User already exist', success: false })
        }
        const password = req.body.password;
        const confirmPassword = req.body.confirmPassword;

        //if password not matches
        if (password !== confirmPassword) {
            return res.status(200).send({ message: 'Confirm Password not matchs', success: false })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt);
        const hashedConfirmPassword = await bcrypt.hash(confirmPassword, salt);
        req.body.password = hashedPassword;
        req.body.confirmPassword = hashedConfirmPassword;

        const newUser = new userModel(req.body)
        await newUser.save()
        res.status(201).send({ message: 'Registered Successfully', success: true });


    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: `Register controller ${error.message}` })
    }
};


const loginController = async (req, res) => {
    try {
        const user = await userModel.findOne({ email: req.body.email })
        if (!user) {
            return res.status(200).send({ message: 'User not found', success: false })
        }
        const isMatch = await bcrypt.compare(req.body.password, user.password)
        if (!isMatch) {
            return res.status(200).send({ message: 'Invalid Email or Password', success: false });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' })
        res.status(200).send({ message: 'Login Success', success: true, token });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: `Error in Login CTRL ${error.message}` })
    }
}

const authController = async (req, res) => {
    try {
        const user = await userModel.findById({ _id: req.body.userId })
        user.password = undefined;
        if (!user) {
            return res.status(200).send({
                message: "User not found", success: false
            })
        } else {
            res.status(200).send({
                success: true,
                data: user
            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: 'Auth Error',
            success: false,
            error
        })
    }
}

const studentRegisterController = async (req, res) => {
    try {
        await studentModel.create({
            ...req.body,
        });

        // Await the update operation to ensure it completes before sending the response
        await userModel.findByIdAndUpdate({ _id: req.body.userId }, { isStudent: true });

        res.status(201).send({
            message: 'Student Registered Successfully',
            success: true,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to register student' });
    }
};

const createClassController = async (req, res) => {
    try {
        const classroom = await classModel.create({
            ...req.body,
        });
        classroom.save();
        await userModel.findByIdAndUpdate({ _id: req.body.userId }, { $push: { classesCreated: classroom._id } });
        res.status(201).send({
            message: 'Class Created Successfully',
            success: true,
            data: classroom
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create class' });
    }
}

const getClassroomController = async (req, res) => {
    try {
      const classroom = await classModel.findOne({ _id: req.body.classId});

      if (!classroom) {
            return res.status(200).send({
                success: true,
                message: 'Class ID not found || You are not the Faculty of the Class.',
                data: {
                    isFaculty: false,
                },
            });
        }
        const isFaculty = req.body.userId === classroom.facultyId;

      
        if(isFaculty){
            return res.status(200).send({
            message: 'Classroom Fetched Successfully',
            success: true,
            data: {
                isFaculty,
                classroom,
            },
        });
        }
        else{
            return res.status(200).send({
            error: 'Classroom Fetching Failed',
            success: true,
            data: {
                isFaculty,
                classroom,
            },
        });
        }
    } 
    catch (error) {
      console.error('Error fetching classroom:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
};
  
  

const joinClassroomController = async (req, res) => {
    try {
        const classId = req.body.classId;
        const classroom = await classModel.findOne({ _id: classId });

        if (!classroom) {
            return res.status(200).send({
                success: true,
                message: 'Class ID not found. Please try a different one.',
            });
        }
        const isStudentAlreadyJoined = classroom.studentsJoined.includes(req.body.userId);
        if (isStudentAlreadyJoined) {
            return res.status(200).send({
                message: 'Student has already joined this class',
                success: true,
            });
        }
        await classroom.updateOne({ $push: { studentsJoined: req.body.userId } });

        const user = await userModel.findById({ _id: req.body.userId });
        await user.updateOne({ $push: { classesJoined: classId } });

        res.status(201).send({
            message: 'Joined Class Successfully',
            success: true,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to join class' });
    }
};


const getClassroomsListController = async (req, res) => {
    try {
        const user = await userModel.findById({ _id: req.body.userId });
        const Created = user.classesCreated;
        const Joined = user.classesJoined;
        const CreatedClassrooms = await classModel.find({ _id: { $in: Created } });
        const JoinedClassrooms = await classModel.find({ _id: { $in: Joined } });

        res.status(200).send({
            message: 'Classrooms List Fetched Successfully',
            success: true,
            data: {
                CreatedClassrooms,
                JoinedClassrooms,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch classrooms list' });
    }
}


const getAttendanceRecordsController = async (req, res) => {
    try {
        const user = await userModel.findById({ _id: req.body.userId });
        const userId = user._id.toString(); // Convert the user's ObjectId to a string
        const Joined = user.classesJoined;
        const Created = user.classesCreated;
        const attendancesforJoinedClasses = await attendanceModel.find({ classId: { $in: Joined } });
        const attendancesforCreatedClasses = await attendanceModel.find({ classId: { $in: Created } });

        // Create an object to hold mapped attendances for joined classes
        const joinedAttendanceMap = {};

        // Map attendances to their respective classes for joined classes
        attendancesforJoinedClasses.forEach(attendance => {
            if (!joinedAttendanceMap[attendance.classId]) {
                joinedAttendanceMap[attendance.classId] = [];
            }
            joinedAttendanceMap[attendance.classId].push(attendance);
        });

        // Calculate the presence and absence days for each class for joined classes
        const JoinedAttendanceSummary = {};
        for (const classId in joinedAttendanceMap) {
        const attendances = joinedAttendanceMap[classId];
        let totalDays = 0;
        let presentDays = 0;
        let absentDays = 0;

        attendances.forEach(async attendance => {
        if (attendance.studentsPresent.includes(userId)) {
            presentDays++;
        } else if (attendance.studentsAbsent.includes(userId)) {
            absentDays++;
        }

        try {
            const classInfo = await classModel.findById(attendance.classId);
            const className = classInfo.className; 
            const facultyName = classInfo.facultyName;
            JoinedAttendanceSummary[classId] = {
                facultyName,
                className, 
                totalDays: presentDays + absentDays,
                presentDays,
                absentDays,
            };
        } catch (error) {
            console.error('Failed to fetch class information', error);
            res.status(500).json({ error: 'Failed to fetch class information' });
        }
    });
}



         // Create an object to hold mapped attendances for created classes
         const createdAttendanceMap = {};

         // Map attendances to their respective classes for created classes
         attendancesforCreatedClasses.forEach(attendance => {
             if (!createdAttendanceMap[attendance.classId]) {
                 createdAttendanceMap[attendance.classId] = [];
             }
             createdAttendanceMap[attendance.classId].push(attendance);
         });

         const CreatedAttendanceSummary = {};
        // Calculate the average of total students, average of student present, and average of students absent for each created class
        for (const classId in createdAttendanceMap) {
            const attendances = createdAttendanceMap[classId];
            let totalPresentStudents = 0;
            let totalAbsentStudents = 0;

            attendances.forEach(async attendance => {
                totalPresentStudents += attendance.studentsPresent.length;
                totalAbsentStudents += attendance.studentsAbsent.length;

                try {
                    const classInfo = await classModel.findById(attendance.classId);
                    const className = classInfo.className; 
                    CreatedAttendanceSummary[classId] = {
                        className, 
                        averageTotalStudents: (totalPresentStudents + totalAbsentStudents) / attendances.length,
                        averagePresentStudents: totalPresentStudents / attendances.length,
                        averageAbsentStudents: totalAbsentStudents / attendances.length,
                    };
                } catch (error) {
                    console.error('Failed to fetch class information', error);
                    res.status(500).json({ error: 'Failed to fetch class information' });
                }
            });
        }

         res.status(200).send({
             message: 'Attendance Records Fetched Successfully',
             success: true,
             data: {
                 JoinedAttendanceSummary,
                 CreatedAttendanceSummary,
             },
         });
     } catch (error) {
         console.error(error);
         res.status(500).json({ error: 'Failed to fetch attendance records' });
     }
 };



export { loginController, registerController, authController, studentRegisterController, createClassController, joinClassroomController, getClassroomsListController, getAttendanceRecordsController, getClassroomController };