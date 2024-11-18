import React, { useState, useEffect } from "react";
import axios from "axios";
import ReceptionNavbar from "./ReceptionNavbar";

const Report = () => {
  const [aptID, setAptID] = useState("");
  const [searchAptID, setSearchAptID] = useState("");
  const [appointments, setAppointments] = useState([]); // Store fetched appointment data
  const [appointmentDetails, setAppointmentDetails] = useState(null);
  const [reportDetails, setReportDetails] = useState({
    primaryDiagnosis: "",
    prescription: "",
    procedures: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");

  // Fetch all appointments on component mount
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/appointments/getAllAppointments"
        );
        setAppointments(response.data.appointment || []); // Store appointments in state
      } catch (error) {
        console.error("Failed to fetch appointments:", error);
        alert("Unable to fetch appointments. Please try again.");
      }
    };

    fetchAppointments();
  }, []);

  // Fetch appointment details
  useEffect(() => {
    const fetchAppointmentDetails = async () => {
      if (!searchAptID) return;

      try {
        const response = await axios.get(
          `http://localhost:3000/api/appointments/details/${searchAptID}`
        );
        setAppointmentDetails(response.data.details);
      } catch (error) {
        console.error("Failed to fetch appointment details:", error);
        alert("Unable to fetch appointment details. Please try again.");
      }
    };

    fetchAppointmentDetails();
  }, [searchAptID]);

  // Fetch report details
  const fetchReport = async () => {
    if (!searchAptID) return;

    try {
      const response = await axios.get(`http://localhost:3000/api/report/get`, {
        params: { aptID: searchAptID },
      });
      const { report, message } = response.data;

      if (report) {
        setReportDetails(report);
        setIsEditing(true); // If report exists, set editing to true
      } else {
        alert(message || "No report found. Please create one.");
        setReportDetails({
          primaryDiagnosis: "",
          prescription: "",
          procedures: "",
        });
        setIsEditing(false); // If no report exists, it's create mode
      }
    } catch (error) {
      console.error("Failed to fetch report:", error);
      alert("Unable to fetch report. Please try again.");
    }
  };

  useEffect(() => {
    fetchReport(); // Call fetchReport when searchAptID changes
  }, [searchAptID]);

  const handleReportSubmit = async (e) => {
    e.preventDefault();

    // Validate that all fields are filled
    if (
      !reportDetails.primaryDiagnosis ||
      !reportDetails.prescription ||
      !reportDetails.procedures
    ) {
      setError("All fields are required.");
      return;
    }

    try {
      const endpoint = isEditing
        ? "http://localhost:3000/api/report/update"
        : "http://localhost:3000/api/report/create"; // Set the correct endpoint for creating or updating
      const method = isEditing ? "put" : "post"; // Use PUT if updating, POST if creating
      const response = await axios[method](endpoint, {
        aptID: searchAptID,
        primaryDiagnosis: reportDetails.primaryDiagnosis,
        prescription: reportDetails.prescription,
        procedures: reportDetails.procedures,
      });

      alert(response.data.message || "Report saved successfully!");

      // After successful creation or update, fetch the latest report to display
      fetchReport(); // This will reload the report details from the server

      setIsEditing(true); // Set editing mode after creation
      setError(""); // Clear any errors
    } catch (error) {
      console.error("Failed to save report:", error);
      alert("Failed to save report. Please try again.");
    }
  };

  const handlePrint = () => {
    if (!reportDetails || !appointmentDetails) {
      alert("No complete details available to print.");
      return;
    }

    const { appointment, patient, dentist } = appointmentDetails;
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Report - Appointment ID: ${searchAptID}</title>
          <script src="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css"></script>
        </head>
        <body class="bg-gray-50 font-sans text-gray-900 p-8">
          <div class="max-w-4xl mx-auto bg-white p-8 shadow-lg rounded-lg border border-gray-200">
            <h1 class="text-4xl font-extrabold text-teal-700 text-center mb-10">Patient Report</h1>
            
            <!-- Appointment Details Section -->
            <div class="section mb-10">
              <h2 class="text-2xl font-semibold text-teal-600 mb-4 border-b-2 border-teal-600 pb-2">Appointment Details</h2>
              <ul class="space-y-3 text-lg">
                <li><span class="font-medium text-teal-500">Appointment ID:</span> ${
                  appointment.aptID
                }</li>
                <li><span class="font-medium text-teal-500">Date:</span> ${new Date(
                  appointment.date
                ).toLocaleDateString()}</li>
                <li><span class="font-medium text-teal-500">Time:</span> ${
                  appointment.time
                }</li>
              </ul>
            </div>
    
            <!-- Patient Details Section -->
            <div class="section mb-10">
              <h2 class="text-2xl font-semibold text-teal-600 mb-4 border-b-2 border-teal-600 pb-2">Patient Details</h2>
              <ul class="space-y-3 text-lg">
                <li><span class="font-medium text-teal-500">Name:</span> ${
                  patient.name
                }</li>
                <li><span class="font-medium text-teal-500">Age:</span> ${
                  patient.age
                }</li>
                <li><span class="font-medium text-teal-500">Gender:</span> ${
                  patient.gender
                }</li>
              </ul>
            </div>
    
            <!-- Dentist Details Section -->
            <div class="section mb-10">
              <h2 class="text-2xl font-semibold text-teal-600 mb-4 border-b-2 border-teal-600 pb-2">Dentist Details</h2>
              <ul class="space-y-3 text-lg">
                <li><span class="font-medium text-teal-500">Name:</span> ${
                  dentist.name
                }</li>
                <li><span class="font-medium text-teal-500">Specialization:</span> ${
                  dentist.specialization
                }</li>
              </ul>
            </div>
    
            <!-- Report Details Section -->
            <div class="section mb-10">
              <h2 class="text-2xl font-semibold text-teal-600 mb-4 border-b-2 border-teal-600 pb-2">Report Details</h2>
              <div class="space-y-4 text-lg">
                <p><span class="font-medium text-teal-500">Primary Diagnosis:</span> ${
                  reportDetails.primaryDiagnosis
                }</p>
                <p><span class="font-medium text-teal-500">Prescription:</span> ${
                  reportDetails.prescription
                }</p>
                <p><span class="font-medium text-teal-500">Procedures:</span> ${
                  reportDetails.procedures
                }</p>
              </div>
            </div>
    
            <!-- Footer -->
            <div class="text-center mt-12 border-t-2 border-gray-200 pt-4">
              <p class="text-lg text-gray-600">Generated on: ${new Date().toLocaleString()}</p>
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const validateForm = () => {
    return (
      reportDetails.primaryDiagnosis &&
      reportDetails.prescription &&
      reportDetails.procedures
    );
  };

  return (
    <div>
      <ReceptionNavbar />
      <div className="flex justify-center items-center min-h-screen bg-white-100">
        <div class="w-full p-4 px-[30px] mb-6 border border-gray-300 rounded-md shadow-md hover:shadow-xl transition-shadow duration-300 mx-5 my-1.5">
          <h1 className="text-3xl font-semibold text-teal-600 mb-6">
            Patient Report
          </h1>
          <div className="mb-6">
            <label
              htmlFor="appointment"
              className="block text-teal-700 text-lg"
            >
              Appointment ID
            </label>
            <select
              id="appointment"
              className="w-full mt-2 p-2 border border-gray-300 rounded-lg"
              value={aptID}
              onChange={(e) => {
                setAptID(e.target.value);
                setSearchAptID(e.target.value); // Set the searchAptID when an aptID is selected
              }}
            >
              <option value="">Select Appointment ID</option>
              {appointments.map((apt) => (
                <option key={apt.aptID} value={apt.aptID}>
                  {apt.aptID}
                </option>
              ))}
            </select>
          </div>

          {appointmentDetails && (
            <div className="mb-6">
              <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
                <div className="p-6">
                  <h2 className="text-3xl font-semibold text-teal-700 mb-4">
                    Appointment Details
                  </h2>
                  <ul className="space-y-4 text-lg text-gray-700">
                    <li className="flex justify-between">
                      <span className="font-medium text-teal-500">
                        Patient Name:
                      </span>
                      <span>{appointmentDetails.patient.name}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="font-medium text-teal-500">Age:</span>
                      <span>{appointmentDetails.patient.age}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="font-medium text-teal-500">Gender:</span>
                      <span>{appointmentDetails.patient.gender}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="font-medium text-teal-500">
                        Consulted Dentist:
                      </span>
                      <span>{appointmentDetails.dentist.name}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="font-medium text-teal-500">Date:</span>
                      <span>
                        {new Date(
                          appointmentDetails.appointment.date
                        ).toLocaleDateString()}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span className="font-medium text-teal-500">Time:</span>
                      <span>{appointmentDetails.appointment.time}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {reportDetails ? (
            <form onSubmit={handleReportSubmit} className="space-y-6">
              <div>
                <label className="block text-teal-700 text-lg">
                  Primary Diagnosis
                </label>
                <textarea
                  name="primaryDiagnosis"
                  value={reportDetails.primaryDiagnosis}
                  onChange={(e) =>
                    setReportDetails({
                      ...reportDetails,
                      primaryDiagnosis: e.target.value,
                    })
                  }
                  className="w-full p-3 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-teal-700 text-lg">
                  Prescription
                </label>
                <textarea
                  name="prescription"
                  value={reportDetails.prescription}
                  onChange={(e) =>
                    setReportDetails({
                      ...reportDetails,
                      prescription: e.target.value,
                    })
                  }
                  className="w-full p-3 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-teal-700 text-lg">
                  Procedures
                </label>
                <textarea
                  name="procedures"
                  value={reportDetails.procedures}
                  onChange={(e) =>
                    setReportDetails({
                      ...reportDetails,
                      procedures: e.target.value,
                    })
                  }
                  className="w-full p-3 border rounded-lg"
                  required
                />
              </div>
              {error && <p className="text-red-600">{error}</p>}
              <div className="flex justify-between mt-6">
                <button
                  type="submit"
                  disabled={!validateForm()}
                  className="bg-teal-600 text-white py-2 px-6 rounded-lg disabled:opacity-50"
                >
                  {isEditing ? "Update Report" : "Create Report"}
                </button>
                <button
                  type="button"
                  onClick={handlePrint}
                  className="bg-teal-600 text-white py-2 px-6 rounded-lg"
                >
                  Print Report
                </button>
              </div>
            </form>
          ) : (
            <p className="text-teal-700">No report available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Report;
