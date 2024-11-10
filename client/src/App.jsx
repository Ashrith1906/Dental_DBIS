import React from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./components/contexts/AuthContext";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import { ToastContainer } from "react-toastify"; // Import ToastContainer
import "react-toastify/dist/ReactToastify.css";
import Dentist from './components/Dentists/Dentist';
import Receptionist from './components/Reception/Receptionist';
import PatientProfile from './components/Reception/PatientProfile'
const App = () => {
  return (
    <Router>
      <AuthProvider>
      <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Navigate to="/login" />} />
          {/* <Route path="/Dentist" element={<Dentist/>}/>
          <Route path="/Receptionist" element={<Receptionist/>}/> */}
          <Route
            path="/dentist"
            element={<PrivateRoute role="Dentist" Component={Dentist} />}
          />

          <Route
            path="/receptionist"
            element={<PrivateRoute role="Receptionist" Component={Receptionist} />}
          />
          <Route
            path="/patient-profile"
            element={<PrivateRoute role="Receptionist" Component={PatientProfile} />}
          />


        </Routes>
        <ToastContainer position="top-right" autoClose={3000} /> {/* Move ToastContainer here */}
      </AuthProvider>
    </Router>
  );
};

// Private Route Component
const PrivateRoute = ({ role, Component }) => {
  const { userRole } = useAuth();
  console.log(userRole);
  return userRole === role ? <Component /> : <Navigate to="/login" />;
};

export default App;