import React, { useState, useEffect } from "react";
import axios from "axios";
import ReceptionNavbar from "./ReceptionNavbar";

const Report = () => {
  const [aptID, setAptID] = useState(""); // Store appointment ID
  const [patientDetails, setPatientDetails] = useState({
    name: "Loading...",
    age: "Loading...",
    gender: "Loading...",
    phone_no: "Loading...",
  }); // Store patient details
  const [dentistDetails, setDentistDetails] = useState({
    name: "Loading...",
    specialization: "Loading...",
  }); // Store dentist details
  const [appointmentDetails, setAppointmentDetails] = useState({
    date: "Loading...",
    time: "Loading...",
    reason: "Loading...",
  }); // Store appointment details
  const [reportDetails, setReportDetails] = useState({
    primary_diagnosis: "",
    prescription: "",
    procedures: "",
  }); // Store report details

  const [isEditing, setIsEditing] = useState(false); // Toggle for editing the report

  // Fetch appointment and related details by aptID
  useEffect(() => {
    const fetchDetails = async () => {
      if (!aptID) return; // Prevent unnecessary calls

      try {
        const response = await axios.get(
          `http://localhost:3000/api/appointments/details/${aptID}`
        );
        const { details } = response.data;

        setPatientDetails(details.patient || {
          name: "Not Available",
          age: "Not Available",
          gender: "Not Available",
          phone_no: "Not Available",
        });
        setDentistDetails(details.dentist || {
          name: "Not Available",
          specialization: "Not Available",
        });
        setAppointmentDetails(details.appointment || {
          date: "Not Available",
          time: "Not Available",
          reason: "Not Available",
        });
      } catch (error) {
        console.error("Failed to fetch appointment details:", error);
        alert("Unable to fetch appointment details. Please try again.");
      }
    };

    fetchDetails();
  }, [aptID]);

  // Handle input change for report fields
  const handleReportChange = (e) => {
    setReportDetails({ ...reportDetails, [e.target.name]: e.target.value });
  };

  // Toggle between editing and viewing modes
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  // Submit the report data to the backend
  const handleReportSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/api/report/create", {
        aptID,
        primaryDiagnosis: reportDetails.primary_diagnosis,
        prescription: reportDetails.prescription,
        procedures: reportDetails.procedures,
      });
      if (response.data.message === "Report created successfully") {
        alert("Report saved successfully!");
        setIsEditing(false); // Disable editing after submission
      }
    } catch (error) {
      console.error("Failed to save report:", error);
      alert("Failed to save report. Please try again.");
    }
  };

  // Print function that opens a new tab with the report content
  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Report - Appointment ID: ${aptID}</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 20px; background-color: #f1f5f9; color: #333; }
            h1 { color: #005eb8; }
            .section { margin-bottom: 20px; }
            .section strong { color: #333; }
            .section p { margin: 4px 0; }
          </style>
        </head>
        <body>
          <h1>Patient Report</h1>
          <div class="section">
            <h2>Appointment Details</h2>
            <p><strong>Appointment ID:</strong> ${aptID}</p>
            <p><strong>Date:</strong> ${appointmentDetails.date}</p>
            <p><strong>Time:</strong> ${appointmentDetails.time}</p>
            <p><strong>Reason for Appointment:</strong> ${appointmentDetails.reason}</p>
          </div>
          <div class="section">
            <h2>Patient Details</h2>
            <p><strong>Name:</strong> ${patientDetails.name}</p>
            <p><strong>Age:</strong> ${patientDetails.age}</p>
            <p><strong>Gender:</strong> ${patientDetails.gender}</p>
            <p><strong>Phone:</strong> ${patientDetails.phone_no}</p>
          </div>
          <div class="section">
            <h2>Dentist Details</h2>
            <p><strong>Dentist Name:</strong> ${dentistDetails.name}</p>
            <p><strong>Specialization:</strong> ${dentistDetails.specialization}</p>
          </div>
          <div class="section">
            <h2>Report Details</h2>
            <p><strong>Primary Diagnosis:</strong> ${reportDetails.primary_diagnosis}</p>
            <p><strong>Prescription:</strong> ${reportDetails.prescription}</p>
            <p><strong>Procedures:</strong> ${reportDetails.procedures}</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div>
      <ReceptionNavbar />

      <div className="bg-gray-50 min-h-screen flex flex-col items-center py-8">
        <div className="bg-white p-8 shadow-lg rounded-lg w-full max-w-3xl">
          <h1 className="text-3xl font-semibold text-teal-700 mb-6">Patient Report</h1>

          {/* Appointment ID and Details */}
          <div className="mb-6 bg-teal-50 p-4 rounded-lg shadow-sm">
            <div className="flex items-center space-x-4">
              <label htmlFor="aptID" className="font-medium text-teal-700 text-lg">
                Appointment ID:
              </label>
              <input
                type="text"
                id="aptID"
                value={aptID}
                onChange={(e) => setAptID(e.target.value)}
                className="p-2 border border-teal-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Enter Appointment ID"
              />
            </div>

            {aptID && (
              <div className="mt-4 space-y-2">
                <p>
                  <strong>Date:</strong> {appointmentDetails.date}
                </p>
                <p>
                  <strong>Time:</strong> {appointmentDetails.time}
                </p>
                <p>
                  <strong>Reason for Appointment:</strong>{" "}
                  {appointmentDetails.reason}
                </p>
              </div>
            )}
          </div>

          {/* Patient Details */}
          {aptID && (
            <div className="mb-6 bg-teal-50 p-4 rounded-lg shadow-sm">
              <div className="space-y-2">
                <p>
                  <strong>Name:</strong> {patientDetails.name}
                </p>
                <p>
                  <strong>Age:</strong> {patientDetails.age}
                </p>
                <p>
                  <strong>Gender:</strong> {patientDetails.gender}
                </p>
                <p>
                  <strong>Phone:</strong> {patientDetails.phone_no}
                </p>
              </div>
            </div>
          )}

          {/* Dentist Details */}
          {aptID && (
            <div className="mb-6 bg-teal-50 p-4 rounded-lg shadow-sm">
              <div className="space-y-2">
                <p>
                  <strong>Dentist Name:</strong> {dentistDetails.name}
                </p>
                <p>
                  <strong>Specialization:</strong> {dentistDetails.specialization}
                </p>
              </div>
            </div>
          )}

          {/* Report Details */}
          <form onSubmit={handleReportSubmit} className="space-y-6">
            <div>
              <label className="block text-teal-700 text-lg">Primary Diagnosis</label>
              <textarea
                name="primary_diagnosis"
                value={reportDetails.primary_diagnosis}
                onChange={handleReportChange}
                className="w-full p-3 border border-teal-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                disabled={!isEditing}
              ></textarea>
            </div>

            <div>
              <label className="block text-teal-700 text-lg">Prescription</label>
              <textarea
                name="prescription"
                value={reportDetails.prescription}
                onChange={handleReportChange}
                className="w-full p-3 border border-teal-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                disabled={!isEditing}
              ></textarea>
            </div>

            <div>
              <label className="block text-teal-700 text-lg">Procedures</label>
              <textarea
                name="procedures"
                value={reportDetails.procedures}
                onChange={handleReportChange}
                className="w-full p-3 border border-teal-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                disabled={!isEditing}
              ></textarea>
            </div>


            <div className="flex items-center space-x-4">
             <button
                type="button"
                onClick={handleEditToggle}
                className="bg-teal-600 text-white p-3 rounded-md hover:bg-teal-700"
              >
                {isEditing ? "Cancel Editing" : "Edit Report"}
              </button>
              {isEditing && (
              <button
              type="submit"
              className="bg-teal-600 text-white p-3 rounded-md hover:bg-teal-700"
            >
              Save Report
            </button>
              )}
              <button
                type="button"
                onClick={handlePrint}
                className="bg-teal-600 text-white p-3 rounded-md hover:bg-teal-700"
              >
                Print Report
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Report;