import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import Login from "../pages/Auth/Login";
import Signup from "../pages/Auth/Signup";
import StudentDashboard from "../pages/StudentDashboard";
import AdminDashboard from "../pages/AdminDashboard";

export default function AppRoutes() {
  const [role, setRole] = useState(sessionStorage.getItem("role"));

  // Sync role when sessionStorage changes
  useEffect(() => {
    const updateRole = () => setRole(sessionStorage.getItem("role"));
    window.addEventListener("storage", updateRole);

    return () => window.removeEventListener("storage", updateRole);
  }, []);

  // Also refresh role after each login
  useEffect(() => {
    setRole(sessionStorage.getItem("role"));
  });

  return (
    <BrowserRouter>
      <Routes>
        
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* STUDENT DASHBOARD */}
        <Route
          path="/student"
          element={
            role === "student" ? <StudentDashboard /> : <Navigate to="/" />
          }
        />

        {/* ADMIN DASHBOARD */}
        <Route
          path="/admin"
          element={
            role === "admin" ? <AdminDashboard /> : <Navigate to="/" />
          }
        />

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
