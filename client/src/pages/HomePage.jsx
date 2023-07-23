import React, { useRef, useState } from "react";
import axios from "axios";
import Layout from "../componenets/Layout";
import "../styles/HomePage.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import "../styles/HomePage.css";
import { Modal, Form, Input, message } from "antd";

const HomePage = () => {
  const { user } = useSelector((state) => state.user);
  const isStudent = user ? user.isStudent : false;
  const dispatch = useDispatch();
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const formRef = useRef(null); //useRef is used to access the form values of form to register students
  const modalFormRef = useRef(null); //useRef is used to access the form values of form to join class
  const modalCreateClassRef = useRef(null); //useRef is used to access the form values of form to create class


  const [isCreateClassModalOpen, setIsCreateClassModalOpen] = useState(false);
  const showCreateClassModal = () => {
    setIsCreateClassModalOpen(true);
  };
  const handleCreateClassCancel = () => {
    setIsCreateClassModalOpen(false);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const [
    isStudentRegistrationModalOpen,
    setIsStudentRegistrationModalOpen,
  ] = useState(false);
  const showStudentRegistrationModal = () => {
    setIsStudentRegistrationModalOpen(true);
  };
  const handleStudentRegistrationCancel = () => {
    setIsStudentRegistrationModalOpen(false);
  };

  const handleFinish = async (values) => {
    setIsStudentRegistrationModalOpen(false);
    const formData = new FormData();
    formData.append("userId", user._id);
    formData.append("name", values.name);
    formData.append("studentId", values.studentId);
    formData.append("image", selectedFile);
    const contentType = selectedFile.type || "png"; // Set the contentType or use a default value
    formData.append("contentType", contentType);
    try {
      dispatch(showLoading());
      const res = await axios.post(
        "/api/v1/user/student-register",
        {
          ...values,
          userId: user._id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        message.success(res.data.message);
        navigate("/");
        window.location.reload();
      } else {
        message.error(res.data.success);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      message.error("Something went wrong");
    }
  };

  const handleJoinClass = async (values) => {
    try {
      dispatch(showLoading());
      const classId = values.classId;
      if(classId.length!==24){
        message.error("Invalid Class ID");
        window.location.reload();
        return;
      }
      const res= await axios.post("/api/v1/user/join-classroom", 
      {
        ...values,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
      );
      dispatch(hideLoading());
      if(res.data.success){
        message.success(res.data.message);
        navigate("/");
      }
      else{
        message.error(res.data.message);
      }

    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      message.error(error.message);
    }
  };

  const handleCreateClass = async (values) => {
    setIsCreateClassModalOpen(false);
    try {
      dispatch(showLoading());
      const res = await axios.post(
        "/api/v1/user/create-classroom",
        {
          ...values,
          facultyId: user._id,
          facultyName: user.name,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        const classId = res.data.data._id; // Accessing the ID from the "data" field in the response
        message.success(res.data.message);
        navigate(`/classroom/${classId}`); // Navigating to the newly created classroom
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      message.error("Something went wrong");
    }
  };
  

  return (
    <Layout>
      <div
        className="w3-container w3-content w3-center w3-padding-64"
        style={{ maxWidth: 800 }}
        id="band"
      >
        <h2 className="w3-wide">Wellcome to AttendHub</h2>
        <p className="w3-opacity">
          <i>A Product to make Attendance of a meeting easy !</i>
        </p>
      </div>

      <div class="container text-center">
        <div class="row">
          <div class="col">
            <button
              class="button-78"
              role="button"
              onClick={showCreateClassModal}
            >
              Create a Class
            </button>
          </div>
          <div class="col">
            <button
              class="button-77"
              role="button"
              onClick={isStudent ? showModal : showStudentRegistrationModal}
            >
              Join a Class
            </button>
          </div>
        </div>
      </div>

      <div>
        <>
          <Modal
            title="Enter the Name of Classroom"
            open={isCreateClassModalOpen}
            okText="Create"
            onOk={() => {
              modalCreateClassRef.current.submit();
            }}
            onCancel={handleCreateClassCancel}
          >
            <Form ref={modalCreateClassRef} onFinish={handleCreateClass}>
              <Form.Item
                name="className"
                required
                rules={[{ required: true }]}
              >
                <Input type="text" placeholder="Classroom Name" />
              </Form.Item>
            </Form>
          </Modal>
        </>
      </div>

      <div>
        <>
          <Modal
            title="Class ID"
            open={isModalOpen}
            okText="Join"
            onOk={() => {
              modalFormRef.current.submit();
            }}
            onCancel={handleCancel}
          >
            <Form ref={modalFormRef} onFinish={handleJoinClass}>
              <Form.Item
                Label="Enter the Class ID"
                name="classId"
                required
                rules={[{ required: true }]}
              >
                <Input type="text" placeholder="Enter the Class ID" />
              </Form.Item>
            </Form>
          </Modal>
        </>
      </div>

      <div>
        <>
          <Modal
            title="Student Registration"
            open={isStudentRegistrationModalOpen}
            okText="Submit"
            onOk={() => {
              formRef.current.submit();
            }}
            onCancel={handleStudentRegistrationCancel}
          >
            <Form
              ref={formRef}
              onFinish={handleFinish}
              layout="vertical"
              className="m-3"
            >
              <Form.Item
                label="Name"
                name="name"
                required
                rules={[{ required: true }]}
              >
                <Input type="text" placeholder="Your Name" />
              </Form.Item>
              <Form.Item
                label="Student ID"
                name="studentId"
                required
                rules={[{ required: true }]}
              >
                <Input type="text" />
              </Form.Item>
              <Form.Item
                label="Upload Your an Image"
                name="image"
                required
                rules={[{ required: true }]}
              >
                <Input type="file" onChange={handleFileChange} />
              </Form.Item>
            </Form>
          </Modal>
        </>
      </div>
    </Layout>
  );
};

export default HomePage;
