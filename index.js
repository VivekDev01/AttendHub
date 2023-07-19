import express from "express";
import colors from "colors";
import morgan from "morgan";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import router from "./routes/userRoutes.js";

//dotenv config
dotenv.config();

//mongodb connection
connectDB();

//rest object
const app=express();

//midleware
app.use(express.json());
app.use(morgan('dev'));

//routes
app.use("/api/v1/user", router);

//listen port
const port=process.env.PORT || 4000
app.listen(port, ()=>{
    console.log(`Server Running in ${process.env.NODE_MODE} Mode on port ${port}`.bgCyan.white);
});