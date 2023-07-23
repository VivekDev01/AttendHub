import React, { useState, useEffect } from "react";
import Layout from "../componenets/Layout";
import axios from "axios";
import { Table, Tabs } from "antd";
const { TabPane } = Tabs;

const AttendanceRecord = () => {
  const [activeTopTab, setActiveTopTab] = useState("1"); // Store the active top-level tab key
  const [activeInnerTab, setActiveInnerTab] = useState("1"); // Store the active inner-level tab key
  const [joinedClassroomsSummary, setJoinedClassroomsSummary] = useState({});
  const [createdClassroomsSummary, setCreatedClassroomsSummary] = useState({});

  const getClassroomsList = async () => {
    try {
      const res = await axios.get("/api/v1/user/getAttendanceRecords", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data.success) {
        setJoinedClassroomsSummary(res.data.data.JoinedAttendanceSummary);
        setCreatedClassroomsSummary(res.data.data.CreatedAttendanceSummary);
      } else {
        console.log(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getClassroomsList();
  }, []); 


 
  const columnsForJoinedClassrooms = [
    {
      title: "Class Name",
      dataIndex: "className", // Add className column for joined classrooms
    },
    {
      title: "Faculty Name",
      dataIndex: "facultyName",
    },
    {
      title: "Total Class Days",
      dataIndex: "totalDays",
    },
    {
      title: "Present Days",
      dataIndex: "presentDays",
    },
    {
      title: "Absent Days",
      dataIndex: "absentDays",
    },
  ];

  const columnsForCreatedClassrooms = [
    {
      title: "Class Name",
      dataIndex: "className", // Add className column for created classrooms
    },
    {
      title: "Average Total Students",
      dataIndex: "averageTotalStudents",
    },
    {
      title: "Average Present Students",
      dataIndex: "averagePresentStudents",
    },
    {
      title: "Average Absent Students",
      dataIndex: "averageAbsentStudents",
    },
  ];

  const renderJoinedClassrooms = () => {
    if (!joinedClassroomsSummary || Object.keys(joinedClassroomsSummary).length === 0) {
      return <p>No classrooms found.</p>;
    }
    return (
      <Tabs defaultActiveKey="1" tabPosition="left" activeKey={activeInnerTab} onChange={onInnerTabChange}>
        {Object.entries(joinedClassroomsSummary).map(([classId, classroom]) => (
          <TabPane tab={classroom.className} key={classId}>
            <Table dataSource={[classroom]} columns={columnsForJoinedClassrooms} />
          </TabPane>
        ))}
      </Tabs>
    );
  };

  const renderCreatedClassrooms = () => {
    if (!createdClassroomsSummary || Object.keys(createdClassroomsSummary).length === 0) {
      return <p>No classrooms found.</p>;
    }
    return (
      <Tabs defaultActiveKey="1" tabPosition="left" activeKey={activeInnerTab} onChange={onInnerTabChange}>
        {Object.entries(createdClassroomsSummary).map(([classId, classroom]) => (
          <TabPane tab={classroom.className} key={classId}>
            <Table dataSource={[classroom]} columns={columnsForCreatedClassrooms} />
          </TabPane>
        ))}
      </Tabs>
    );
  };


  const onTopTabChange = (key) => {
    setActiveTopTab(key); // Update the active top-level tab key when a tab is changed
  };

  const onInnerTabChange = (key) => {
    setActiveInnerTab(key); // Update the active inner-level tab key when a tab is changed
  };

  return (
<Layout>
      <div>
        <Tabs defaultActiveKey="1" activeKey={activeTopTab} onChange={onTopTabChange}>
          <TabPane tab="Joined Classrooms" key="1">
            {renderJoinedClassrooms()}
          </TabPane>
          <TabPane tab="Created Classrooms" key="2">
            {renderCreatedClassrooms()}
          </TabPane>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AttendanceRecord;
