import express from "express";
import { authController, loginController, registerController, studentRegisterController, createClassController, getClassroomsListController} from "../controllers/userCtrl.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import multer from "multer";


//rputer object
const router = express.Router()

//routes

//LOGIN || POST
router.post('/login', loginController)

//REGISTER || POST
router.post('/register', registerController)

//Authorization || POST
router.post('/getUserData', authMiddleware, authController)

const upload = multer();
router.post("/student-register", authMiddleware, studentRegisterController)

router.post("/create-classroom", authMiddleware, createClassController)

router.get("/getClassroomsList", authMiddleware, getClassroomsListController )

export default router;