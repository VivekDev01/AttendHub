import React, { useState } from "react";
import Layout from "../componenets/Layout";
import { useParams } from "react-router-dom";
import "../styles/Classroom.css";
import { message } from "antd";
import whatsapp from "../images/whatsapp.png";

const Classroom = () => {
  const { classId } = useParams();
  const [isAttendanceStarted, setIsAttendanceStarted] = useState(false);

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
  }

  const handleStopAttendance = () => {
    alert("Attendance stopped!");
    setIsAttendanceStarted(false);
  }

  return (
    <Layout>
      <div className="copy">
      <h5 style={{color:"white"}}>Share the Class Code with Students</h5>
          <div className="container-copy">
            <input
              type="text"
              id="text-1"
              defaultValue={classId}
              readOnly
            />
            <button onClick={() => copy("text-1")}>
              Copy
            </button>
            <img onClick={shareOnWhatsApp} src={whatsapp} alt="Share on Whatsapp" style={{cursor:"pointer", width:"40px", marginLeft:"5px"}} />
          </div>

          <div className="container-copy">
            <h1>Live</h1>
          </div>

          <div className="container-attendance">
            {isAttendanceStarted ? <button onClick={handleStopAttendance}>Stop Attendance</button> :  <button onClick={handleAttendance}>Start Attendance</button>}
          </div>
      </div>
    </Layout>
  );
};

export default Classroom;
