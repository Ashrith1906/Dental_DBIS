// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useAuth } from "../contexts/AuthContext";
// import {
//   FaUser,
//   FaCalendarAlt,
//   FaClock,
//   FaTooth,
//   FaVenusMars,
//   FaBirthdayCake,
// } from "react-icons/fa";
// import DentistNavbar from "./DentistNavbar";

// const ReportD = () => {
//   const { dentistId } = useAuth(); // get dentistId from context
//   const [aptID, setAptID] = useState("");
//   const [searchAptID, setSearchAptID] = useState("");
//   const [appointments, setAppointments] = useState([]);
//   const [appointmentDetails, setAppointmentDetails] = useState(null);
//   const [reportDetails, setReportDetails] = useState({
//     primaryDiagnosis: "",
//     prescription: "",
//     procedures: "",
//   });
//   const [isEditing, setIsEditing] = useState(false);
//   const [error, setError] = useState("");

//   // Fetch all appointments for this dentist on mount or dentistId change
//   useEffect(() => {
//     if (!dentistId) return;

//     const fetchAppointments = async () => {
//       try {
//         const response = await axios.get(
//           `http://localhost:3000/api/appointments/getAllAppointmentsByDentistId`,
//           {
//             params: { dentistId },
//           }
//         );
//         setAppointments(response.data.appointments || []);
//       } catch (error) {
//         console.error("Failed to fetch appointments:", error);
//         alert("Unable to fetch appointments. Please try again.");
//       }
//     };

//     fetchAppointments();
//   }, [dentistId]);

//   // Fetch appointment details when searchAptID changes
//   useEffect(() => {
//     const fetchAppointmentDetails = async () => {
//       if (!searchAptID) return;

//       try {
//         const response = await axios.get(
//           `http://localhost:3000/api/appointments/details/${searchAptID}`
//         );
//         setAppointmentDetails(response.data.details);
//       } catch (error) {
//         console.error("Failed to fetch appointment details:", error);
//         alert("Unable to fetch appointment details. Please try again.");
//       }
//     };

//     fetchAppointmentDetails();
//   }, [searchAptID]);

//   // Fetch report details for selected appointment
//   useEffect(() => {
//     const fetchReport = async () => {
//       if (!searchAptID) return;

//       try {
//         const response = await axios.get(`http://localhost:3000/api/report/get`, {
//           params: { aptID: searchAptID },
//         });
//         const { report, message } = response.data;

//         if (report) {
//           setReportDetails(report);
//           setIsEditing(true);
//         } else {
//           setReportDetails({
//             primaryDiagnosis: "",
//             prescription: "",
//             procedures: "",
//           });
//           setIsEditing(false);
//           alert(message || "No report found. Please create one.");
//         }
//       } catch (error) {
//         console.error("Failed to fetch report:", error);
//         alert("Unable to fetch report. Please try again.");
//       }
//     };

//     fetchReport();
//   }, [searchAptID]);

//   // Submit new or updated report
//   const handleReportSubmit = async (e) => {
//     e.preventDefault();

//     if (
//       !reportDetails.primaryDiagnosis ||
//       !reportDetails.prescription ||
//       !reportDetails.procedures
//     ) {
//       setError("All fields are required.");
//       return;
//     }

//     try {
//       const endpoint = isEditing
//         ? "http://localhost:3000/api/report/update"
//         : "http://localhost:3000/api/report/create";
//       const method = isEditing ? "put" : "post";

//       const response = await axios[method](endpoint, {
//         aptID: searchAptID,
//         primaryDiagnosis: reportDetails.primaryDiagnosis,
//         prescription: reportDetails.prescription,
//         procedures: reportDetails.procedures,
//       });

//       alert(response.data.message || "Report saved successfully!");
//       setIsEditing(true);
//       setError("");
//     } catch (error) {
//       console.error("Failed to save report:", error);
//       alert("Failed to save report. Please try again.");
//     }
//   };

//   const handlePrint = () => {
//     if (!reportDetails || !appointmentDetails) {
//       alert("No complete details available to print.");
//       return;
//     }

//     const { appointment, patient, dentist } = appointmentDetails;
//     const printWindow = window.open("", "_blank");
//     printWindow.document.write(`
//       <html>
//         <head>
//           <title>Report - Appointment ID: ${searchAptID}</title>
//           <style>
//             body { font-family: Arial, sans-serif; padding: 20px; color: #333; background-color: #f9f9f9; }
//             .container { width: 80%; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #fff; }
//             h1, h2 { text-align: center; color: #007bff; }
//             .section { margin-bottom: 20px; }
//             .section ul { list-style-type: none; padding: 0; }
//             .section li { margin-bottom: 10px; }
//             .section li span { font-weight: bold; }
//           </style>
//         </head>
//         <body>
//           <div class="container">
//             <h1>Report - Appointment ID: ${searchAptID}</h1>
//             <div class="section">
//               <h2>Appointment Details</h2>
//               <ul>
//                 <li><span>Appointment ID:</span> ${appointment.aptID}</li>
//                 <li><span>Date:</span> ${new Date(appointment.date).toLocaleDateString()}</li>
//                 <li><span>Time:</span> ${appointment.time}</li>
//               </ul>
//             </div>
//             <div class="section">
//               <h2>Patient Details</h2>
//               <ul>
//                 <li><span>Name:</span> ${patient.name}</li>
//                 <li><span>Age:</span> ${patient.age}</li>
//                 <li><span>Gender:</span> ${patient.gender}</li>
//               </ul>
//             </div>
//             <div class="section">
//               <h2>Dentist Details</h2>
//               <ul>
//                 <li><span>Name:</span> ${dentist.name}</li>
//                 <li><span>Specialization:</span> ${dentist.specialization}</li>
//               </ul>
//             </div>
//             <div class="section">
//               <h2>Report Details</h2>
//               <ul>
//                 <li><span>Primary Diagnosis:</span> ${reportDetails.primaryDiagnosis}</li>
//                 <li><span>Prescription:</span> ${reportDetails.prescription}</li>
//                 <li><span>Procedures:</span> ${reportDetails.procedures}</li>
//               </ul>
//             </div>
//             <div class="text-center mt-12">
//               <p>Generated on: ${new Date().toLocaleString()}</p>
//             </div>
//           </div>
//         </body>
//       </html>
//     `);
//     printWindow.document.close();
//     printWindow.print();
//   };

//   const validateForm = () =>
//     reportDetails.primaryDiagnosis &&
//     reportDetails.prescription &&
//     reportDetails.procedures;

//   return (
//     <div>
//       <DentistNavbar />
//       <div className="flex justify-center items-center min-h-screen bg-white-100 px-5">
//         <div className="w-full p-4 px-[30px] mb-6 border border-gray-300 rounded-md shadow-md hover:shadow-xl transition-shadow duration-300 mx-5 my-1.5">
//           <h1 className="text-3xl font-semibold text-teal-600 mb-6">
//             Patient's Report
//           </h1>

//           {/* Appointment Dropdown */}
//           <div className="mb-6">
//             <label htmlFor="appointment" className="block text-teal-700 text-lg">
//               Appointment ID
//             </label>
//             <select
//               id="appointment"
//               className="w-full mt-2 p-2 border border-gray-300 rounded-lg"
//               value={aptID}
//               onChange={(e) => {
//                 setAptID(e.target.value);
//                 setSearchAptID(e.target.value);
//               }}
//             >
//               <option value="">Select Appointment ID</option>
//               {appointments.map((apt) => (
//                 <option key={apt.aptID} value={apt.aptID}>
//                   {apt.aptID} - {apt.patientName}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Appointment details */}
//           {appointmentDetails && (
//             <div className="mb-6">
//               <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
//                 <div className="p-6">
//                   <h2 className="text-3xl font-semibold text-teal-700 mb-4">
//                     Appointment Details
//                   </h2>
//                   <ul className="space-y-4 text-lg text-gray-700">
//                     <li className="flex justify-between items-center">
//                       <span className="flex items-center">
//                         <FaUser className="text-teal-500 mr-2" />
//                         <span className="font-medium text-teal-500">
//                           Patient Name:
//                         </span>
//                       </span>
//                       <span>{appointmentDetails.patient.name}</span>
//                     </li>
//                     <li className="flex justify-between items-center">
//                       <span className="flex items-center">
//                         <FaBirthdayCake className="text-teal-500 mr-2" />
//                         <span className="font-medium text-teal-500">Age:</span>
//                       </span>
//                       <span>{appointmentDetails.patient.age}</span>
//                     </li>
//                     <li className="flex justify-between items-center">
//                       <span className="flex items-center">
//                         <FaVenusMars className="text-teal-500 mr-2" />
//                         <span className="font-medium text-teal-500">
//                           Gender:
//                         </span>
//                       </span>
//                       <span>{appointmentDetails.patient.gender}</span>
//                     </li>
//                     <li className="flex justify-between items-center">
//                       <span className="flex items-center">
//                         <FaTooth className="text-teal-500 mr-2" />
//                         <span className="font-medium text-teal-500">
//                           Consulted Dentist:
//                         </span>
//                       </span>
//                       <span>{appointmentDetails.dentist.name}</span>
//                     </li>
//                     <li className="flex justify-between items-center">
//                       <span className="flex items-center">
//                         <FaCalendarAlt className="text-teal-500 mr-2" />
//                         <span className="font-medium text-teal-500">Date:</span>
//                       </span>
//                       <span>
//                         {new Date(appointmentDetails.appointment.date).toLocaleDateString()}
//                       </span>
//                     </li>
//                     <li className="flex justify-between items-center">
//                       <span className="flex items-center">
//                         <FaClock className="text-teal-500 mr-2" />
//                         <span className="font-medium text-teal-500">Time:</span>
//                       </span>
//                       <span>{appointmentDetails.appointment.time}</span>
//                     </li>
//                   </ul>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Report form */}
//           {searchAptID && (
//             <form onSubmit={handleReportSubmit} className="mb-6">
//               <div className="mb-4">
//                 <label
//                   htmlFor="primaryDiagnosis"
//                   className="block text-teal-700 text-lg font-semibold mb-1"
//                 >
//                   Primary Diagnosis
//                 </label>
//                 <textarea
//                   id="primaryDiagnosis"
//                   value={reportDetails.primaryDiagnosis}
//                   onChange={(e) =>
//                     setReportDetails({ ...reportDetails, primaryDiagnosis: e.target.value })
//                   }
//                   className="w-full p-2 border border-gray-300 rounded-md"
//                   rows={3}
//                   required
//                 />
//               </div>

//               <div className="mb-4">
//                 <label
//                   htmlFor="prescription"
//                   className="block text-teal-700 text-lg font-semibold mb-1"
//                 >
//                   Prescription
//                 </label>
//                 <textarea
//                   id="prescription"
//                   value={reportDetails.prescription}
//                   onChange={(e) =>
//                     setReportDetails({ ...reportDetails, prescription: e.target.value })
//                   }
//                   className="w-full p-2 border border-gray-300 rounded-md"
//                   rows={3}
//                   required
//                 />
//               </div>

//               <div className="mb-4">
//                 <label
//                   htmlFor="procedures"
//                   className="block text-teal-700 text-lg font-semibold mb-1"
//                 >
//                   Procedures
//                 </label>
//                 <textarea
//                   id="procedures"
//                   value={reportDetails.procedures}
//                   onChange={(e) =>
//                     setReportDetails({ ...reportDetails, procedures: e.target.value })
//                   }
//                   className="w-full p-2 border border-gray-300 rounded-md"
//                   rows={3}
//                   required
//                 />
//               </div>

//               {error && (
//                 <p className="text-red-600 text-sm mb-4 font-semibold">{error}</p>
//               )}

//               <button
//                 type="submit"
//                 className="w-full py-2 px-4 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition duration-300"
//                 disabled={!validateForm()}
//               >
//                 {isEditing ? "Update Report" : "Create Report"}
//               </button>
//             </form>
//           )}

//           {/* Print button */}
//           {isEditing && (
//             <button
//               onClick={handlePrint}
//               className="w-full py-2 px-4 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition duration-300"
//             >
//               Print Report
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ReportD;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import {
  FaUser,
  FaCalendarAlt,
  FaClock,
  FaTooth,
  FaVenusMars,
  FaBirthdayCake,
} from "react-icons/fa";
import DentistNavbar from "./DentistNavbar";

const ReportD = () => {
  const { dentistId } = useAuth(); // get dentistId from context
  const [aptID, setAptID] = useState("");
  const [searchAptID, setSearchAptID] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [appointmentDetails, setAppointmentDetails] = useState(null);
  const [reportDetails, setReportDetails] = useState({
    primaryDiagnosis: "",
    prescription: "",
    procedures: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");

  // Fetch all appointments for this dentist on mount or dentistId change
  useEffect(() => {
    if (!dentistId) return;

    const fetchAppointments = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/appointments/getAllAppointmentsByDentistId`,
          {
            params: { dentistId },
          }
        );
        setAppointments(response.data.appointments || []);
      } catch (error) {
        console.error("Failed to fetch appointments:", error);
        alert("Unable to fetch appointments. Please try again.");
      }
    };

    fetchAppointments();
  }, [dentistId]);

  // Fetch appointment details when searchAptID changes
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

  // Fetch report details for selected appointment
  useEffect(() => {
    const fetchReport = async () => {
      if (!searchAptID) return;

      try {
        const response = await axios.get(
          `http://localhost:3000/api/report/get`,
          {
            params: { aptID: searchAptID },
          }
        );
        const { report, message } = response.data;

        if (report) {
          setReportDetails(report);
          setIsEditing(true);
        } else {
          setReportDetails({
            primaryDiagnosis: "",
            prescription: "",
            procedures: "",
          });
          setIsEditing(false);
          alert(message || "No report found. Please create one.");
        }
      } catch (error) {
        console.error("Failed to fetch report:", error);
        alert("Unable to fetch report. Please try again.");
      }
    };

    fetchReport();
  }, [searchAptID]);

  // Submit new or updated report
  const handleReportSubmit = async (e) => {
    e.preventDefault();

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
        : "http://localhost:3000/api/report/create";
      const method = isEditing ? "put" : "post";

      const response = await axios[method](endpoint, {
        aptID: searchAptID,
        primaryDiagnosis: reportDetails.primaryDiagnosis,
        prescription: reportDetails.prescription,
        procedures: reportDetails.procedures,
      });

      alert(response.data.message || "Report saved successfully!");
      setIsEditing(true);
      setError("");
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
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
      />
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@600;900&display=swap');

        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: #f3f6f5;
          color: #094d47;
          padding: 20px 10px;
          margin: 0;
          -webkit-print-color-adjust: exact;
          font-size: 14px; /* base smaller font */
        }
        .container {
          max-width: 700px;
          margin: auto;
          background: #ffffff;
          padding: 25px 30px;
          border-radius: 12px;
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);
          border: 1px solid #d0e6e2;
        }
        h1 {
          font-family: 'Poppins', sans-serif;
          font-weight: 900;
          font-size: 2rem; /* smaller */
          text-align: center;
          color: #05695f;
          margin-bottom: 30px;
          letter-spacing: 1.5px;
        }
        .section {
          margin-bottom: 28px;
          padding-bottom: 18px;
          border-bottom: 2px solid #0f766e88;
        }
        .section:last-child {
          border-bottom: none;
          margin-bottom: 16px;
          padding-bottom: 0;
        }
        .section h2 {
          font-family: 'Poppins', sans-serif;
          font-weight: 700;
          font-size: 1.4rem; /* smaller */
          color: #0f766e;
          margin-bottom: 18px;
          display: flex;
          align-items: center;
          gap: 10px;
          border-left: 5px solid #0f766e;
          padding-left: 10px;
          text-transform: uppercase;
          letter-spacing: 0.07em;
        }
        ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        li {
          display: flex;
          align-items: center;
          margin-bottom: 12px;
          font-size: 1rem; /* smaller */
          line-height: 1.3;
        }
        li:last-child {
          margin-bottom: 0;
        }
        i.fa {
          color: #0f766e;
          min-width: 22px;
          font-size: 16px; /* smaller */
          margin-right: 10px;
          text-align: center;
          width: 22px;
        }
        span.label {
          font-weight: 700;
          min-width: 140px;
          color: #055b4e;
          letter-spacing: 0.04em;
          text-transform: capitalize;
        }
        .footer {
          text-align: center;
          font-size: 0.9rem;
          color: #0f766e99;
          font-style: italic;
          margin-top: 40px;
          border-top: 1px solid #0f766e33;
          padding-top: 14px;
        }

        @media print {
          body {
            background: white;
            color: #094d47;
            font-size: 13px;
          }
          .container {
            box-shadow: none;
            border: none;
            padding: 0;
            max-width: 100%;
            margin: 0;
          }
          .section {
            border-color: #0f766e44;
            padding-bottom: 14px;
            margin-bottom: 24px;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1><i class="fa fa-file-medical-alt"></i> Patient Report</h1>

        <div class="section">
          <h2><i class="fa fa-calendar-check"></i> Appointment Details</h2>
          <ul>
            <li><i class="fa fa-hashtag"></i> <span class="label">Appointment ID:</span> ${
              appointment.aptID
            }</li>
            <li><i class="fa fa-calendar"></i> <span class="label">Date:</span> ${new Date(
              appointment.date
            ).toLocaleDateString()}</li>
            <li><i class="fa fa-clock"></i> <span class="label">Time:</span> ${
              appointment.time
            }</li>
          </ul>
        </div>

        <div class="section">
          <h2><i class="fa fa-user"></i> Patient Details</h2>
          <ul>
            <li><i class="fa fa-user"></i> <span class="label">Name:</span> ${
              patient.name
            }</li>
            <li><i class="fa fa-birthday-cake"></i> <span class="label">Age:</span> ${
              patient.age
            }</li>
            <li><i class="fa fa-venus-mars"></i> <span class="label">Gender:</span> ${
              patient.gender
            }</li>
          </ul>
        </div>

        <div class="section">
          <h2><i class="fa fa-tooth"></i> Dentist Details</h2>
          <ul>
            <li><i class="fa fa-user-md"></i> <span class="label">Name:</span> ${
              dentist.name
            }</li>
            <li><i class="fa fa-tooth"></i> <span class="label">Specialization:</span> ${
              dentist.specialization
            }</li>
          </ul>
        </div>

        <div class="section">
          <h2><i class="fa fa-file-medical"></i> Report Details</h2>
          <ul>
            <li><span class="label">Primary Diagnosis:</span> ${
              reportDetails.primaryDiagnosis
            }</li>
            <li><span class="label">Prescription:</span> ${
              reportDetails.prescription
            }</li>
            <li><span class="label">Procedures Done:</span> ${
              reportDetails.procedures
            }</li>
          </ul>
        </div>

        <div class="footer">
          Report generated on: ${new Date().toLocaleString()}
        </div>
      </div>
    </body>
  </html>
`);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  const validateForm = () =>
    reportDetails.primaryDiagnosis &&
    reportDetails.prescription &&
    reportDetails.procedures;

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-blue-50 to-teal-100"
      style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}
    >
      <DentistNavbar />
      <div className="flex justify-center items-start py-12 px-5">
        <div className="max-w-4xl w-full bg-white rounded-2xl shadow-2xl p-8 space-y-8 border border-gray-300">
          <h1 className="text-3xl font-extrabold text-teal-700 mb-6 text-center">
            Patient's Report
          </h1>

          {/* Appointment Dropdown */}
          <div>
            <label
              htmlFor="appointment"
              className="block text-sm font-semibold text-teal-900 mb-1"
            >
              Appointment ID
            </label>
            <select
              id="appointment"
              className="w-full p-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400"
              value={aptID}
              onChange={(e) => {
                setAptID(e.target.value);
                setSearchAptID(e.target.value);
              }}
            >
              <option value="" className="text-gray-400">
                Select Appointment ID
              </option>
              {appointments.map((apt) => (
                <option key={apt.aptID} value={apt.aptID}>
                  {apt.aptID} - {apt.patientName}
                </option>
              ))}
            </select>
          </div>

          {/* Appointment details */}
          {appointmentDetails && (
            <div className="bg-white shadow-xl rounded-xl border border-gray-300 p-6">
              <h2 className="text-3xl font-extrabold text-teal-700 mb-5">
                Appointment Details
              </h2>
              <ul className="space-y-5 text-lg text-gray-700">
                <li className="flex justify-between items-center">
                  <span className="flex items-center text-teal-500 font-semibold">
                    <FaUser className="mr-3" size={20} />
                    Patient Name:
                  </span>
                  <span className="text-teal-900 font-medium">
                    {appointmentDetails.patient.name}
                  </span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="flex items-center text-teal-500 font-semibold">
                    <FaBirthdayCake className="mr-3" size={20} />
                    Age:
                  </span>
                  <span className="text-teal-900 font-medium">
                    {appointmentDetails.patient.age}
                  </span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="flex items-center text-teal-500 font-semibold">
                    <FaVenusMars className="mr-3" size={20} />
                    Gender:
                  </span>
                  <span className="text-teal-900 font-medium">
                    {appointmentDetails.patient.gender}
                  </span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="flex items-center text-teal-500 font-semibold">
                    <FaTooth className="mr-3" size={20} />
                    Consulted Dentist:
                  </span>
                  <span className="text-teal-900 font-medium">
                    {appointmentDetails.dentist.name}
                  </span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="flex items-center text-teal-500 font-semibold">
                    <FaCalendarAlt className="mr-3" size={20} />
                    Date:
                  </span>
                  <span className="text-teal-900 font-medium">
                    {new Date(
                      appointmentDetails.appointment.date
                    ).toLocaleDateString()}
                  </span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="flex items-center text-teal-500 font-semibold">
                    <FaClock className="mr-3" size={20} />
                    Time:
                  </span>
                  <span className="text-teal-900 font-medium">
                    {appointmentDetails.appointment.time}
                  </span>
                </li>
              </ul>
            </div>
          )}

          {/* Report form */}
          {searchAptID && (
            <form onSubmit={handleReportSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="primaryDiagnosis"
                  className="block text-sm font-extrabold text-teal-900 mb-1"
                >
                  Primary Diagnosis
                </label>
                <textarea
                  id="primaryDiagnosis"
                  value={reportDetails.primaryDiagnosis}
                  onChange={(e) =>
                    setReportDetails({
                      ...reportDetails,
                      primaryDiagnosis: e.target.value,
                    })
                  }
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-800 placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-teal-400"
                  placeholder="Enter the primary diagnosis"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="prescription"
                  className="block text-sm font-extrabold text-teal-900 mb-1"
                >
                  Prescription
                </label>
                <textarea
                  id="prescription"
                  value={reportDetails.prescription}
                  onChange={(e) =>
                    setReportDetails({
                      ...reportDetails,
                      prescription: e.target.value,
                    })
                  }
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-800 placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-teal-400"
                  placeholder="Enter the prescription"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="procedures"
                  className="block text-sm font-extrabold text-teal-900 mb-1"
                >
                  Procedures Done
                </label>
                <textarea
                  id="procedures"
                  value={reportDetails.procedures}
                  onChange={(e) =>
                    setReportDetails({
                      ...reportDetails,
                      procedures: e.target.value,
                    })
                  }
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-800 placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-teal-400"
                  placeholder="Enter procedures done"
                  required
                />
              </div>

              {error && (
                <p className="text-red-600 font-semibold text-center">
                  {error}
                </p>
              )}

              <div className="flex justify-between items-center">
                <button
                  type="submit"
                  disabled={!validateForm()}
                  className={`px-6 py-3 font-bold rounded-xl text-white shadow-lg transition-colors duration-300
                    ${
                      validateForm()
                        ? "bg-teal-700 hover:bg-teal-900"
                        : "bg-teal-300 cursor-not-allowed"
                    }`}
                >
                  {isEditing ? "Update Report" : "Create Report"}
                </button>

                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-5 py-3 font-semibold rounded-xl text-teal-700 border-2 border-teal-700 hover:bg-teal-700 hover:text-white transition-colors duration-300 shadow-md"
                  disabled={!isEditing}
                >
                  Print Report
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportD;
