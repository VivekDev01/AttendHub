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
  const [isAttendanceStarted, setIsAttendanceStarted] = useState(false);
  const navigate = useNavigate();
  const [classroom, setClassroom] = useState({});

  if(classId.length!==24){
    message.error("Invalid Class ID");
    navigate("/");
    return;
  }

  const getClassroom = async () => {
    try {
      const res = await axios.post(
        "/api/v1/user/getClassroom",
        { classId: classId },
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
          return ;
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

  const handleAttendance = () => {
    alert("Attendance started!");
    setIsAttendanceStarted(true);
  };

  const handleStopAttendance = () => {
    alert("Attendance stopped!");
    setIsAttendanceStarted(false);
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

        <div className="container-copy">
          <h1>Live</h1>
        </div>

        <div className="container-attendance">
          {isAttendanceStarted ? (
            <button onClick={handleStopAttendance}>Stop Attendance</button>
          ) : (
            <button onClick={handleAttendance}>Start Attendance</button>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Classroom;
