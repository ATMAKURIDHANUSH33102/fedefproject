import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "../pages/Auth/Login";
import Signup from "../pages/Auth/Signup";
import StudentDashboard from "../pages/StudentDashboard";
import AdminDashboard from "../pages/AdminDashboard";

export default function AppRoutes() {
  const [userRole, setUserRole] = useState(sessionStorage.getItem("role"));

  // This keeps userRole fresh after login navigation
  useEffect(() => {
    const checkRole = () => setUserRole(sessionStorage.getItem("role"));
    window.addEventListener("storage", checkRole);
    return () => window.removeEventListener("storage", checkRole);
  }, []);

  // Also check role after every render, in case login just set it
  useEffect(() => {
    setUserRole(sessionStorage.getItem("role"));
  });

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/student" element={userRole==="student" ? <StudentDashboard /> : <Navigate to="/" />} />
        <Route path="/admin" element={userRole==="admin" ? <AdminDashboard /> : <Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
