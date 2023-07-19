import React, { useState, useRef, useEffect } from "react";
import "../styles/Layout.css";
import { adminMenu, userMenu } from "../Data/data";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { message, Badge } from "antd";

const Layout = ({ children }) => {
  const { user } = useSelector((state) => state.user);
  const location = useLocation();
  const Navigate = useNavigate();

  const [visible, setVisible] = useState(true);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const headerRef = useRef(null);

  useEffect(() => {
    let prevScrollPos = window.scrollY;

    const handleScroll = () => {
      const currentScrollPos = window.scrollY;

      if (headerRef.current) {
        if (prevScrollPos > currentScrollPos) {
          headerRef.current.style.top = "0";
        } else {
          headerRef.current.style.top = `-${headerRef.current.offsetHeight}px`;
        }
      }
      prevScrollPos = currentScrollPos;

      if (currentScrollPos > 200) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLogout = () => {
    localStorage.clear();
    message.success("Logout Successfully");
    Navigate("/login");
  };

  if (!user) {
    return Navigate("/login");
  }

  const doctorMenu = [
    {
      name: "Home",
      path: "/",
      icon: "ri-home-heart-line",
    },
    {
      name: "Appointments",
      path: "/doctor-appointments",
      icon: "ri-list-check",
    },
    {
      name: "Profile",
      path: `/doctor/profile/${user._id}`,
      icon: "fa-solid fa-user-doctor",
    },
  ];

  const hospitalMenu = [
    {
      name: "Home",
      path: "/",
      icon: "ri-home-heart-line",
    },
    {
      name: "Appointments",
      path: "/hospital-appointments",
      icon: "ri-list-check",
    },
    {
      name: "Profile",
      path: `/hospital/profile/${user._id}`,
      icon: "fa-solid fa-user-doctor",
    },
  ];

  

  return (
    <>
      <div className="layout" style={{ backgroundColor: "#ecf0f3" }}>
        {/* Header */}
        <div>
         <h1>I am header</h1>
        </div>

      

        {/* Main Content */}
        <main style={{ marginTop: visible ? "50px" : 0 }}>
          {/* Main content */}
          <div className="children-area">
            <div className="container">{children}</div>
          </div>
        </main>

        <footer> 
          <h1>I am footer</h1>
        </footer>
     
      </div>
    </>
  );
};

export default Layout;
