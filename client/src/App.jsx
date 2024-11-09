import React from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./components/contexts/AuthContext";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import { ToastContainer } from "react-toastify"; // Import ToastContainer
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <Router>
      <AuthProvider>
      <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
        
        <ToastContainer position="top-right" autoClose={3000} /> {/* Move ToastContainer here */}
      </AuthProvider>
    </Router>
  );
};

export default App;