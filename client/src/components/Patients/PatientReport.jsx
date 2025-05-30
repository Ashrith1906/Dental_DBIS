import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import {
  FaUser, FaBirthdayCake, FaVenusMars, FaTooth, FaCalendarAlt, FaClock
} from "react-icons/fa";
import Navbar from "./PatientNavbar";

const PatientReport = () => {
  const { patientId } = useAuth();
  const [aptIds, setAptIds] = useState([]);
  const [selectedAptID, setSelectedAptID] = useState("");
  const [appointmentDetails, setAppointmentDetails] = useState(null);
  const [reportDetails, setReportDetails] = useState(null);

useEffect(() => {
  const fetchAppointmentIDs = async () => {
    if (!patientId) return;

    try {
      const res = await axios.get("http://localhost:3000/api/appointments/getAllAppointmentsByPID", {
        params: { pID: patientId },
      });
      const ids = res.data.appointment.map((apt) => apt.aptID);
      setAptIds(ids);
    } catch (err) {
      console.error("Error fetching appointment IDs", err);
    }
  };

  fetchAppointmentIDs();
}, [patientId]);

  // When aptID is selected, fetch details + report
  useEffect(() => {
    if (!selectedAptID) return;

    const fetchDetails = async () => {
      try {
        const [aptRes, reportRes] = await Promise.all([
          axios.get(`http://localhost:3000/api/appointments/details/${selectedAptID}`),
          axios.get("http://localhost:3000/api/report/get", {
            params: { aptID: selectedAptID },
          }),
        ]);

        setAppointmentDetails(aptRes.data.details);
        setReportDetails(reportRes.data.report);
      } catch (error) {
        console.error("Error fetching appointment or report", error);
        alert("Could not load report.");
        setAppointmentDetails(null);
        setReportDetails(null);
      }
    };

    fetchDetails();
  }, [selectedAptID]);

  return (
    <div>
      <Navbar />
      <div className="flex justify-center items-center min-h-screen bg-white px-4">
        <div className="w-full max-w-3xl border p-6 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold text-teal-600 mb-6 text-center">Your Appointment Reports</h1>

          {/* Dropdown to select aptID */}
          <label className="text-lg text-gray-700 block mb-2">Select Appointment ID:</label>
          <select
            className="w-full p-2 mb-6 border rounded"
            value={selectedAptID}
            onChange={(e) => setSelectedAptID(e.target.value)}
          >
            <option value="">-- Select Appointment --</option>
            {aptIds.map((id) => (
              <option key={id} value={id}>{id}</option>
            ))}
          </select>

          {/* Appointment Details */}
          {appointmentDetails && (
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-teal-700 mb-3">Appointment Info</h2>
              <ul className="text-gray-700 text-lg space-y-2">
                <li><FaUser className="inline text-teal-500 mr-2" /> {appointmentDetails.patient.name}</li>
                <li><FaBirthdayCake className="inline text-teal-500 mr-2" /> Age: {appointmentDetails.patient.age}</li>
                <li><FaVenusMars className="inline text-teal-500 mr-2" /> Gender: {appointmentDetails.patient.gender}</li>
                <li><FaTooth className="inline text-teal-500 mr-2" /> Dentist: {appointmentDetails.dentist.name}</li>
                <li><FaCalendarAlt className="inline text-teal-500 mr-2" /> Date: {new Date(appointmentDetails.appointment.date).toLocaleDateString()}</li>
                <li><FaClock className="inline text-teal-500 mr-2" /> Time: {appointmentDetails.appointment.time}</li>
              </ul>
            </div>
          )}

          {/* Report Section */}
          {reportDetails ? (
            <div>
              <h2 className="text-2xl font-semibold text-teal-700 mb-4">Report</h2>
              <div className="mb-3">
                <label className="font-medium text-teal-600 block">Primary Diagnosis:</label>
                <textarea className="w-full bg-gray-100 p-2 rounded" readOnly value={reportDetails.primaryDiagnosis}></textarea>
              </div>
              <div className="mb-3">
                <label className="font-medium text-teal-600 block">Prescription:</label>
                <textarea className="w-full bg-gray-100 p-2 rounded" readOnly value={reportDetails.prescription}></textarea>
              </div>
              <div className="mb-3">
                <label className="font-medium text-teal-600 block">Procedures:</label>
                <textarea className="w-full bg-gray-100 p-2 rounded" readOnly value={reportDetails.procedures}></textarea>
              </div>

              {/* Print Button */}
              <div className="flex justify-center mt-6">
                <button
                  onClick={() => window.print()}
                  className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-6 rounded shadow"
                >
                  Print Report
                </button>
              </div>
            </div>
          ) : (
            selectedAptID && (
              <p className="text-red-600 font-semibold mt-4">
                No Report Found
                Please wait until doctor uploads your report.
              </p>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientReport;