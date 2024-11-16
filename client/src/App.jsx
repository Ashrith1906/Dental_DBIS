import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./components/contexts/AuthContext";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Dentist from './components/Dentists/Dentist';
import Receptionist from './components/Reception/Receptionist';
import PatientProfile from './components/Reception/PatientProfile';
import DentistProfile from './components/Dentists/DentistProfile';
import PatientRecords from './components/Reception/PatientRecords';
import Invoice from './components/Reception/Invoice';
import Report from './components/Reception/Report';
import DentistSchedule from './components/Dentists/DentistSchedule';

const App = () => {
  return (
    <Router future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Navigate to="/login" />} />

          <Route
            path="/dentist"
            element={<PrivateRoute role="Dentist" Component={Dentist} />}
          />
          <Route
            path="/dentist-profile"
            element={<PrivateRoute role="Dentist" Component={DentistProfile} />}
          />
          <Route
            path="/dentistschedule"
            element={<PrivateRoute role="Dentist" Component={DentistSchedule} />}
          />

          <Route
            path="/receptionist"
            element={<PrivateRoute role="Receptionist" Component={Receptionist} />}
          />
          <Route
            path="/patient-profile"
            element={<PrivateRoute role="Receptionist" Component={PatientProfile} />}
          />
          <Route
            path="/patientrecords"
            element={<PrivateRoute role="Receptionist" Component={PatientRecords} />}
          />
          <Route
            path="/invoice"
            element={<PrivateRoute role="Receptionist" Component={Invoice} />}
          />
          <Route
            path="/reports"
            element={<PrivateRoute role="Receptionist" Component={Report} />}
          />
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} />
      </AuthProvider>
    </Router>
  );
};

// Private Route Component
const PrivateRoute = ({ role, Component }) => {
  const { userRole } = useAuth();

  if (!userRole) {
    return <Navigate to="/login" />;
  }

  return userRole === role ? <Component /> : <Navigate to="/login" />;
};

export default App;