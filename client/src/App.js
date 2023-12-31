import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import HomePage from "./pages/HomePage";
import { useSelector } from "react-redux";
import Spinner from "./componenets/Spinner";
import ProtectedRoute from "./componenets/ProtectedRoute.jsx";
import PublicRoute from "./componenets/PublicRoute.jsx";
import Classroom from "./pages/Classroom.jsx";
import ClassroomList from "./pages/ClassroomList";
import AttendanceRecord from "./pages/AttendanceRecord";
import Streaming from "./pages/Streaming";

function App() {
  const { loading } = useSelector((state) => state.alerts);
  return (
    <>
      <BrowserRouter>
        {loading ? (
          <Spinner />
        ) : (
          <Routes>
            {/* home */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />

            <Route
              path="/classroom/:classId"
              element={
                <ProtectedRoute>
                  <Classroom />
                </ProtectedRoute>
              }
            />

            <Route
              path="/streaming/:classId"
              element={
                <ProtectedRoute>
                  <Streaming />
                </ProtectedRoute>
              }
            />

            <Route
              path="/classroom-list"
              element={
                <ProtectedRoute>
                  <ClassroomList />
                </ProtectedRoute>
              }
            />

            <Route
              path="/attendance-record"
              element={
                <ProtectedRoute>
                  <AttendanceRecord />
                </ProtectedRoute>
              }
            />

          </Routes>
        )}
      </BrowserRouter>
    </>
  );
}

export default App;
