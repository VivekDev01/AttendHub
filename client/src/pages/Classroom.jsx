import React, { useEffect, useState } from "react";
import Layout from "../componenets/Layout";
import { useParams, useNavigate } from "react-router-dom";
import { message } from "antd";
import axios from "axios";
import "../styles/Classroom.css";
import whatsapp from "../images/whatsapp.png";
import { useSelector } from "react-redux";

const Classroom = () => {
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

  const copy = (textId) => {
    const inputElement = document.getElementById(textId);
    inputElement.select();
    document.execCommand("copy");
    message.success("Copied to clipboard!");
  };

  const shareOnWhatsApp = () => {
    const url = `whatsapp://send?text=Join my classroom with class ID: ${classId}`;
    window.open(url, "_blank");
  };

  // "http://localhost:5000/startAttendance"

  const handleStartAttendance = async () => {
    try {
      const timeout = 3000; // Set a timeout of 3 seconds
      const startAttendanceRequest = axios.post("https://attendhub.onrender.com/startAttendance", {
        classId: classId,
        facultyId: classroom.facultyId,
        facultyName: classroom.facultyName,
        className: classroom.className,
        isAttendanceStarted: true,
      });
  
      // Use Promise.race to set a timeout for the request
      const res = await Promise.race([
        startAttendanceRequest,
        new Promise((resolve) =>
          setTimeout(() => resolve({ timeout: true }), timeout)
        ),
      ]);
  
      if (res.timeout) {
        // Handle the case when the request takes longer than 3 seconds
        // In this case, navigate to the streaming page
        navigate(`/streaming/${classId}`);
      } else if (res.data.success) {
        // Handle the case when the request is successful
        message.success(res.data.message);
        navigate(`/streaming/${classId}`);
      } else {
        // Handle any other case or error
        // You can display an error message or handle it as needed
      }
    } catch (error) {
      console.log(error);
      // Handle any error that occurs during the request
      // You can display an error message or handle it as needed
      navigate(`/streaming/${classId}`);
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
        <h5 style={{ color: "white" }}>Share the Class Code with Students</h5>
        <div className="container-copy">
          <input type="text" id="text-1" defaultValue={classId} readOnly />
          <button onClick={() => copy("text-1")}>Copy</button>
          <img
            onClick={shareOnWhatsApp}
            src={whatsapp}
            alt="Share on Whatsapp"
            style={{ cursor: "pointer", width: "40px", marginLeft: "5px" }}
          />
        </div>

        <div className="container-attendance">
            <button onClick={handleStartAttendance}>Start Attendance</button>
        </div>
        </div>
    </Layout>
  );
};

export default Classroom;
