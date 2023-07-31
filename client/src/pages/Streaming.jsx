import React, { useEffect, useState } from "react";
import Layout from "../componenets/Layout";
import { useParams, useNavigate } from "react-router-dom";
import { message } from "antd";
import axios from "axios";
import { useSelector } from "react-redux";
import '../styles/Streaming.css'

const Streaming = () => {
    const { user } = useSelector((state) => state.user);
    const { classId } = useParams();
    const navigate = useNavigate();
    const [classroom, setClassroom] = useState({});
  
    if (classId.length !== 24) {
        message.error("Invalid Class ID");
        navigate("/");
        return;
      }
    
      const getClassroom = async () => {
        try {
          const res = await axios.post(
            "/api/v1/user/getClassroom",
            { classId: classId, userId: user._id },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
    
          if (res.data.success) {
            message.success(res.data.message);
            if (res.data.data.isFaculty === false) {
              navigate("/");
              return;
            }
            setClassroom(res.data.data.classroom);
          }
        } catch (error) {
          console.log(error);
        }
      };
    
    
      const handleStopAttendance = async () => {
        try {
          const res = await axios.post("http://localhost:5000/stopAttendance", {
            classId: classId,
            isAttendanceStarted: false,
          });
          if (res.data.success) {
            message.success(res.data.message);
            navigate(`/classroom/${classId}`);
          }
        } catch (error) {
          console.log(error);
        }
      };
    
      useEffect(() => {
        getClassroom();
      }, []);

  return (
    <Layout>
    <div className="copy">
      <h1 style={{ color: "white" }}>
        {classroom.className} | {classroom.facultyName}{" "}
      </h1>
      

      <div className="container-copy">
        <h1>Live Stream</h1>
        <img src={`http://localhost:5000/attendance/${classId}`} alt="Live Streaming" />
      </div>

      <div className="container-attendance">
          <button onClick={handleStopAttendance}>Stop Attendance</button>
      </div>
    </div>
  </Layout>
  )
}

export default Streaming