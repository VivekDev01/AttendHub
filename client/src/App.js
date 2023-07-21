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
import StudentRegister from "./pages/StudentRegister.jsx";

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
              path="/student-register"
              element={
                <ProtectedRoute>
                  <StudentRegister />
                </ProtectedRoute>
              }
            />

            <Route
              path="/classroom/:classroomId"
              element={
                <ProtectedRoute>
                  <Classroom />
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
