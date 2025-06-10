import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./components/contexts/AuthContext";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import { Toaster } from "react-hot-toast";
import Dentist from "./components/Dentists/Dentist";
import Receptionist from "./components/Reception/Receptionist";
import Patient from "./components/Patients/Patient";
import PatientProfile from "./components/Reception/PatientProfile";
import DentistProfile from "./components/Dentists/DentistProfile";
import PatientRecords from "./components/Reception/PatientRecords";
import DentistRecords from "./components/Reception/DentistRecords";
import Invoice from "./components/Reception/Invoice";
import Report from "./components/Reception/Report";
import DentistSchedule from "./components/Dentists/DentistSchedule";
import Profile from "./components/Patients/Profile";
import PatientReport from "./components/Patients/PatientReport";
import Payments from "./components/Patients/Payments";
import ReportD from "./components/Dentists/ReportsD";
import HomePage from "./components/HomePage";

const App = () => {
  return (
    <Router future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 2500,
            style: {
              fontSize: "14px",
            },
          }}
        />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<HomePage/>} />

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
            element={
              <PrivateRoute role="Dentist" Component={DentistSchedule} />
            }
          />
          <Route
            path="/reportsd"
            element={<PrivateRoute role="Dentist" Component={ReportD} />}
          />

          <Route
            path="/patient"
            element={<PrivateRoute role="Patient" Component={Patient} />}
          />
          <Route
            path="/profile"
            element={<PrivateRoute role="Patient" Component={Profile} />}
          />
          <Route
            path="/patient-reports"
            element={<PrivateRoute role="Patient" Component={PatientReport} />}
          />
          <Route
            path="/patient-payments"
            element={<PrivateRoute role="Patient" Component={Payments} />}
          />

          <Route
            path="/receptionist"
            element={
              <PrivateRoute role="Receptionist" Component={Receptionist} />
            }
          />
          <Route
            path="/patient-profile"
            element={
              <PrivateRoute role="Receptionist" Component={PatientProfile} />
            }
          />
          <Route
            path="/patientrecords"
            element={
              <PrivateRoute role="Receptionist" Component={PatientRecords} />
            }
          />
          <Route
            path="/dentistrecords"
            element={
              <PrivateRoute role="Receptionist" Component={DentistRecords} />
            }
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
