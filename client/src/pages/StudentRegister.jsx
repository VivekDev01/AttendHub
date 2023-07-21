import React, {useState} from 'react'
import Layout from '../componenets/Layout'
import { Form, Row, Col, Input ,message } from 'antd'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux';
import { showLoading, hideLoading } from '../redux/features/alertSlice';
import {useNavigate} from 'react-router-dom'


const StudentRegister = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleFinish = async (values) => {
    // values.preventDefault();// prevent page from reloading

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
        '/api/v1/user/student-register',
        {
          ...values,
          userId: user._id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        message.success(res.data.message);
        navigate('/classroom');
      } else {
        message.error(res.data.success);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      message.error('Something went wrong');
    } 
  }

  return (
    <Layout>
      <h1 className='text-center'>Student Registration</h1>
      <Form layout='vertical' onFinish={handleFinish} className='m-3'>
        <Row gutter={20}>
          <Col xs={24} md={24} lg={8}>
            <Form.Item label='Name' name='name' required rules={[{ required: true }]}>
              <Input type='text' placeholder='Your Name' />
            </Form.Item>
          </Col>
          <Col xs={24} md={24} lg={8}>
            <Form.Item label='Student ID' name='studentId' required rules={[{ required: true }]}>
              <Input type='text' />
            </Form.Item>
          </Col>
          <Col xs={24} md={24} lg={8}>
            <Form.Item label='Upload Your an Image' name='image' required rules={[{ required: true }]}>
              <Input type='file' onChange={handleFileChange} />
            </Form.Item>
          </Col>

          <Col xs={24} md={24} lg={8}>
            <button className='btn btn-primary form-btn text-center' type='submit'>
              Submit
            </button>
          </Col>
        </Row>
      </Form>
    </Layout>
  )
}

export default StudentRegister