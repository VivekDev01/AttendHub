import React, { useEffect, useState} from "react";
import axios from "axios";
import Layout from "../componenets/Layout";
import "../styles/HomePage.css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "../styles/HomePage.css";

const HomePage = () => {
  const { user } = useSelector((state) => state.user);

  const Navigate = useNavigate();

  const handleJoinClass = () => {
      if(user.isStudent){
        Navigate("/classroom");
      }
      else {
        Navigate("/student-register");
      }
  }

  return (
   <Layout>
  <div className="w3-container w3-content w3-center w3-padding-64" style={{maxWidth: 800}} id="band">
    <h2 className="w3-wide">ATTENDENCE SYSTEM</h2>
    <p className="w3-opacity"><i>A Product to make Attendance of a meeting easy !</i></p>
  </div>


  <div class="container text-center">
  <div class="row">
    <div class="col">
    <button class="button-78" role="button">Create a Class</button>
    </div>
    <div class="col">
    <button class="button-77" role="button" onClick={handleJoinClass} >Join a Class</button>
    </div>
  </div>
</div>

    </Layout>
  );
};

export default HomePage;
