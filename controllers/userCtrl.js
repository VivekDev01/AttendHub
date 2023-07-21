import userModel from "../models/userModel.js"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import studentModel from "../models/studentModel.js";
import classModel from "../models/classModel.js";

//register callback
const registerController= async(req, res)=>{
    try {
        const existingUser= await userModel.findOne({email:req.body.email})
        if(existingUser){
            return res.status(200).send({message:'User already exist', success:false})
        }
        const password= req.body.password;
        const confirmPassword= req.body.confirmPassword; 

        //if password not matches
        if(password!==confirmPassword){
            return res.status(200).send({message:'Confirm Password not matchs', success:false})
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt);
        const hashedConfirmPassword = await bcrypt.hash(confirmPassword, salt); 
        req.body.password=hashedPassword;
        req.body.confirmPassword=hashedConfirmPassword;
        
        const newUser= new userModel(req.body)
        await newUser.save()
        res.status(201).send({message:'Registered Successfully', success: true});


    } catch (error) {
        console.log(error);
        res.status(500).send({success:false, message:`Register controller ${error.message}`})
    }
};


const loginController = async(req, res) =>{
    try {
        const user = await userModel.findOne({email: req.body.email})
        if(!user){
            return res.status(200).send({message:'User not found', success:false})
        }
        const isMatch = await bcrypt.compare(req.body.password, user.password) 
        if(!isMatch){
            return res.status(200).send({message: 'Invalid Email or Password', success:false});
        }
        const token=jwt.sign({id:user._id}, process.env.JWT_SECRET, {expiresIn:'1d'})
        res.status(200).send({message:'Login Success', success:true, token});
    } catch (error) {
        console.log(error);
        res.status(500).send({message:`Error in Login CTRL ${error.message}`})
    }
}

const authController= async (req, res) => {
    try {
        const user = await userModel.findById({_id: req.body.userId})
        user.password= undefined;
        if(!user){
            return res.status(200).send({
                message: "User not found", success: false
            })
        }else{
            res.status(200).send({
                success: true, 
                data: user
            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message:'Auth Error',
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
            const classroom= await classModel.create({
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

    const getClassroomsListController = async (req, res) => {
        try {
            const classroomsList = await classModel.find({ facultyId: req.body.userId });
            res.status(200).send({
                message: 'Classrooms List Fetched Successfully',
                success: true,
                data: classroomsList
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to fetch classrooms list' });
        }
    }
  
  

export {loginController, registerController, authController, studentRegisterController, createClassController, getClassroomsListController };