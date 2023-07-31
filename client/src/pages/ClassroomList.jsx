import React, { useEffect, useState } from "react";
import Layout from "../componenets/Layout"; // Corrected the import statement
import axios from "axios";
import { Tabs, Table } from "antd";
import { Link } from "react-router-dom";


const Classes = () => {
  const [joinedClassrooms, setJoinedClassrooms] = useState([]);
  const [createdClassrooms, setCreatedClassrooms] = useState([]);
  const [activeTab, setActiveTab] = useState("1"); // Store the active tab key



  const getClassroomsList = async () => {
    try {
      const res = await axios.get("/api/v1/user/getClassroomsList", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data.success) {
        setJoinedClassrooms(res.data.data.JoinedClassrooms);
        setCreatedClassrooms(res.data.data.CreatedClassrooms);
      } else {
        console.log(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getClassroomsList();
  }, []); // Empty array ensures that this effect runs only once on initial render

  const onChange = (key) => {
    console.log(key);
    setActiveTab(key); // Update the active tab key when a tab is changed
  };

  const columnsForJoinedClassrooms = [
    {
      title: "Classroom ID",
      dataIndex: "_id",
    },
    {
      title: "Classroom Name",
      dataIndex: "className",
    },
    {
      title: "Faculty Name",
      dataIndex: "facultyName",
    },
  ];

  const columnsForCreatedClassrooms = [
    {
      title: "Classroom ID",
      dataIndex: "_id",
      render: (text, record) => (
        <Link to={`/classroom/${record._id}`}>{text}</Link>
      ),
    },
    {
      title: "Classroom Name",
      dataIndex: "className",
      render: (text, record) => (
        <Link to={`/classroom/${record._id}`}>{text}</Link>
      ),
    },
    {
      title: "Faculty Name",
      dataIndex: "facultyName",
    },
    {
      title: "Students Strength",
      dataIndex: "studentsJoined",
      render: (studentsJoined) => studentsJoined.length,
    },
  ];
  

  const renderJoinedClassrooms = () => {
    if (!joinedClassrooms || joinedClassrooms.length === 0) {
      return <p>No joined classrooms found.</p>;
    }
    return <Table dataSource={joinedClassrooms} columns={columnsForJoinedClassrooms} />;
  };

  const renderCreatedClassrooms = () => {
    if (!createdClassrooms || createdClassrooms.length === 0) {
      // Add a loading state or a message indicating that there are no created classrooms
      return <p>No created classrooms found.</p>;
    }
    return <Table  dataSource={createdClassrooms} columns={columnsForCreatedClassrooms} />;
  };

  return (
    <Layout>
      <div>
        {/* Remove the semicolon after "Tabs" component */}
        <Tabs defaultActiveKey="1" onChange={onChange}>
          {/* Render the content based on the selected tab */}
          <Tabs.TabPane tab="Joined Classrooms" key="1" >
            {activeTab === "1" && renderJoinedClassrooms()}
          </Tabs.TabPane>
          <Tabs.TabPane tab="Created Classrooms" key="2">
            {activeTab === "2" && renderCreatedClassrooms()}
          </Tabs.TabPane>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Classes;
