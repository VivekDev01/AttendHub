import React, { useState, useRef, useEffect } from "react";
import "../styles/Layout.css";
import { adminMenu, userMenu } from "../Data/data";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { message, Badge } from "antd";
import AttendHub from "../images/AttendHub.png";
import rocket from "../images/rocket.png";

const Layout = ({ children }) => {
  const { user } = useSelector((state) => state.user);
  const location = useLocation();
  const Navigate = useNavigate();

  const [showSidebar, setShowSidebar] = useState(false);
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

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
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

  const sidebarMenu = user.isAdmin
    ? adminMenu
    : user.isDoctor
    ? doctorMenu
    : user.isHospital
    ? hospitalMenu
    : userMenu;

  const [email, setEmail] = useState("");

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    // Perform any necessary validation on the email input

    // Clear the input field
    setEmail("");

    // Display a success message
    message.success("Subscribed successfully!");
  };

  return (
    <>
      <div className="layout" style={{ backgroundColor: "#ecf0f3" }}>
        {/* Header */}
        <div>
          <header
            ref={headerRef}
            id="header"
            style={{
              top: 0, 
              left: 0,
              right: 0,
              maxHeight: "60px",
            }}
          >
            <div className="container">
              {/* Header content */}
              <nav class="style-4">
                <ul class="menu-4">
                  <li style={{ margin: 0, float: "left", display: "inline" }}>
                    <img src={AttendHub} width="10%" alt="logo" />
                  </li>

                  <li>
                    <a
                      href={location.pathname === "/" ? "#" : "/"}
                      data-hover="Home"
                    >
                      Home
                    </a>
                  </li>
                  <li>
                    <a href="#" onClick={toggleSidebar} data-hover="Services">
                      Services
                    </a>
                  </li>
                  <li>
                    <a href="/#Doctors-list" data-hover="Doctors">
                      Doctors
                    </a>
                  </li>
                  <li>
                    <a href="/#Hospitals-list" data-hover="Hospitals">
                      Hospitals
                    </a>
                  </li>
                  <li>
                    <a href="/#footer" data-hover="About Us">
                      About Us
                    </a>
                  </li>

                  <li style={{ float: "right" }}>
                    <a
                      data-hover="Profile"
                      href='#'
                    >
                      <i class="fa-solid fa-user"></i>
                        {user.name}
                    </a>
                  </li>
                  
                </ul>
              </nav>
            </div>
          </header>
        </div>


        {/* Main Content */}
        <main style={{ marginTop: visible ? "50px" : 0 }}>
          {/* Main content */}
          <div className="children-area">
            <div className="container">{children}</div>
          </div>
        </main>

        <footer id="footer" className="footer-section">
          <div className="container">
            <div className="footer-cta pt-5 pb-5">
              <div className="row">
                <div className="col-xl-4 col-md-4 mb-30">
                  <div className="single-cta">
                    <i className="fas fa-map-marker-alt" />
                    <div className="cta-text">
                      <h4>Find us</h4>
                      <span>IIIT Ranchi, HEC Admin, JUPMI </span>
                    </div>
                  </div>
                </div>
                <div className="col-xl-4 col-md-4 mb-30">
                  <div className="single-cta">
                    <i className="fas fa-phone" />
                    <div className="cta-text">
                      <h4>Call us</h4>
                      <span>+91-6265898778</span>
                    </div>
                  </div>
                </div>
                <div className="col-xl-4 col-md-4 mb-30">
                  <div className="single-cta">
                    <i className="far fa-envelope-open" />
                    <div className="cta-text">
                      <h4>Mail us</h4>
                      <span>vivek65.ugcs20@iiitranchi.ac.in</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="footer-content pt-5 pb-5">
              <div className="row">
                <div className="col-xl-4 col-lg-4 mb-50">
                  <div className="footer-widget">
                    <div className="footer-logo">
                      <a href="/">
                        <img src={AttendHub} className="img-fluid" alt="logo" />
                      </a>
                    </div>
                    <div className="footer-text">
                      <p>
                        A platform to take care of your health and well-being
                      </p>
                    </div>
                    <div className="footer-social-icon">
                      <span>Follow us</span>
                      <a
                        href="https://www.facebook.com/vivekdev.shah/"
                        target="_blank"
                      >
                        <i className="fab fa-facebook-f" />
                      </a>
                      <a
                        href="https://twitter.com/Vivek_Dev01/"
                        target="_blank"
                      >
                        <i className="fab fa-twitter" />
                      </a>
                      <a
                        href="https://instagram.com/vivek_dev01"
                        target="_blank"
                      >
                        <i className="fab fa-instagram instagram-bg" />
                      </a>
                      <a
                        href="https://youtube.com/@vivekdevshah"
                        target="_blank"
                      >
                        <i className="fab fa-youtube" />
                      </a>
                    </div>
                  </div>
                </div>
                <div className="col-xl-4 col-lg-4 col-md-6 mb-30">
                  <div className="footer-widget">
                    <div className="footer-widget-heading">
                      <h3>Useful Links</h3>
                    </div>
                    <ul>
                      <li>
                        <a href={location.pathname === "/" ? "#" : "/"}>Home</a>
                      </li>
                      <li>
                        <a href="#">portfolio</a>
                      </li>
                      <li>
                        <a href="/#footer">About us</a>
                      </li>
                      <li>
                        <a onClick={toggleSidebar} href="#">
                          Our Services
                        </a>
                      </li>
                      <li>
                        <a href="#">Expert Team</a>
                      </li>
                      <li>
                        <a href="/#footer">Contact us</a>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="col-xl-4 col-lg-4 col-md-6 mb-50">
                  <div className="footer-widget">
                    <div className="footer-widget-heading">
                      <h3>Subscribe</h3>
                    </div>
                    <div className="footer-text mb-25">
                      <p>
                        Don’t miss to subscribe to our new feeds, kindly fill
                        the form below.
                      </p>
                    </div>

                    <div className="subscribe-form">
                      <form onSubmit={handleSubscribe}>
                        <input
                          type="text"
                          placeholder="Email Address"
                          value={email}
                          onChange={handleEmailChange}
                        />
                        <button type="submit">
                          <i className="fab fa-telegram-plane" />
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="copyright-area text-center">
            <div className="container">
              <div className="copyright-text">
                <p>
                  Copyright © 2023, All Right Reserved{" "}
                  <a href="https://codepen.io/anupkumar92/">Vivek Dev Shah</a>
                </p>
              </div>
            </div>
          </div>
        </footer>

        {showScrollButton && (
          <img
            className="scroll-to-top"
            onClick={scrollToTop}
            src={rocket}
            alt="scroll-to-top"
          />
        )}
      </div>
    </>
  );
};

export default Layout;
