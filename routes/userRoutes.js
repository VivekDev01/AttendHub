import express from "express";
import { authController, loginController, registerController, studentRegisterController, createClassController, joinClassroomController, getCreatedClassroomsListController} from "../controllers/userCtrl.js";
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

router.post("/join-classroom", authMiddleware, joinClassroomController)

router.get("/getCreatedClassroomsList", authMiddleware, getCreatedClassroomsListController )

export default router;