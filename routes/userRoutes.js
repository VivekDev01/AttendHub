import express from "express";
import { authController, loginController, registerController, createClassController, getClassroomController, joinClassroomController, getClassroomsListController, getAttendanceRecordsController} from "../controllers/userCtrl.js";
import authMiddleware from "../middlewares/authMiddleware.js";


//rputer object
const router = express.Router()

//routes

//LOGIN || POST
router.post('/login', loginController)

//REGISTER || POST
router.post('/register', registerController)

//Authorization || POST
router.post('/getUserData', authMiddleware, authController)

router.post("/getClassroom", authMiddleware, getClassroomController)

router.post("/create-classroom", authMiddleware, createClassController)

router.post("/join-classroom", authMiddleware, joinClassroomController)

router.get("/getClassroomsList", authMiddleware, getClassroomsListController)

router.get("/getAttendanceRecords", authMiddleware, getAttendanceRecordsController)

export default router;