// import { useState, useEffect } from "react";
// import axios from "axios";
// import { useAuth } from "../contexts/AuthContext";
// import toast from "react-hot-toast";
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
//           `${
//             import.meta.env.VITE_API_BASE_URL
//           }appointments/getAllAppointmentsByDentistId`,
//           {
//             params: { dentistId },
//           }
//         );
//         const fetchedAppointments = response.data.appointments || [];

//         setAppointments(fetchedAppointments);

//         if (fetchedAppointments.length === 0) {
//           toast.info("You have no appointment history yet.");
//         }
//       } catch (error) {
//         console.error("Failed to fetch appointments:", error);
//         toast.error("Something went wrong while loading your appointments.");
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
//           `${
//             import.meta.env.VITE_API_BASE_URL
//           }appointments/details/${searchAptID}`
//         );

//         if (response.data?.details) {
//           setAppointmentDetails(response.data.details);
//         } else {
//           toast.info("No details found for the selected appointment.");
//         }
//       } catch (error) {
//         console.error("Failed to fetch appointment details:", error);
//         toast.error("Couldn't load appointment details. Please try again.");
//       }
//     };

//     fetchAppointmentDetails();
//   }, [searchAptID]);

//   // Fetch report details for selected appointment
//   useEffect(() => {
//     const fetchReport = async () => {
//       if (!searchAptID) return;

//       try {
//         const response = await axios.get(
//           `${import.meta.env.VITE_API_BASE_URL}report/get`,
//           {
//             params: { aptID: searchAptID },
//           }
//         );
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
//         ? `${import.meta.env.VITE_API_BASE_URL}report/update`
//         : `${import.meta.env.VITE_API_BASE_URL}report/create`;
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
//   <html>
//     <head>
//       <title>Report - Appointment ID: ${searchAptID}</title>
//       <link
//         rel="stylesheet"
//         href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
//       />
//       <style>
//         @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@600;900&display=swap');

//         body {
//           font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
//           background: #f3f6f5;
//           color: #094d47;
//           padding: 20px 10px;
//           margin: 0;
//           -webkit-print-color-adjust: exact;
//           font-size: 14px; /* base smaller font */
//         }
//         .container {
//           max-width: 700px;
//           margin: auto;
//           background: #ffffff;
//           padding: 25px 30px;
//           border-radius: 12px;
//           box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);
//           border: 1px solid #d0e6e2;
//         }
//         h1 {
//           font-family: 'Poppins', sans-serif;
//           font-weight: 900;
//           font-size: 2rem; /* smaller */
//           text-align: center;
//           color: #05695f;
//           margin-bottom: 30px;
//           letter-spacing: 1.5px;
//         }
//         .section {
//           margin-bottom: 28px;
//           padding-bottom: 18px;
//           border-bottom: 2px solid #0f766e88;
//         }
//         .section:last-child {
//           border-bottom: none;
//           margin-bottom: 16px;
//           padding-bottom: 0;
//         }
//         .section h2 {
//           font-family: 'Poppins', sans-serif;
//           font-weight: 700;
//           font-size: 1.4rem; /* smaller */
//           color: #0f766e;
//           margin-bottom: 18px;
//           display: flex;
//           align-items: center;
//           gap: 10px;
//           border-left: 5px solid #0f766e;
//           padding-left: 10px;
//           text-transform: uppercase;
//           letter-spacing: 0.07em;
//         }
//         ul {
//           list-style: none;
//           padding: 0;
//           margin: 0;
//         }
//         li {
//           display: flex;
//           align-items: center;
//           margin-bottom: 12px;
//           font-size: 1rem; /* smaller */
//           line-height: 1.3;
//         }
//         li:last-child {
//           margin-bottom: 0;
//         }
//         i.fa {
//           color: #0f766e;
//           min-width: 22px;
//           font-size: 16px; /* smaller */
//           margin-right: 10px;
//           text-align: center;
//           width: 22px;
//         }
//         span.label {
//           font-weight: 700;
//           min-width: 140px;
//           color: #055b4e;
//           letter-spacing: 0.04em;
//           text-transform: capitalize;
//         }
//         .footer {
//           text-align: center;
//           font-size: 0.9rem;
//           color: #0f766e99;
//           font-style: italic;
//           margin-top: 40px;
//           border-top: 1px solid #0f766e33;
//           padding-top: 14px;
//         }

//         @media print {
//           body {
//             background: white;
//             color: #094d47;
//             font-size: 13px;
//           }
//           .container {
//             box-shadow: none;
//             border: none;
//             padding: 0;
//             max-width: 100%;
//             margin: 0;
//           }
//           .section {
//             border-color: #0f766e44;
//             padding-bottom: 14px;
//             margin-bottom: 24px;
//           }
//         }
//       </style>
//     </head>
//     <body>
//       <div class="container">
//         <h1><i class="fa fa-file-medical-alt"></i> Patient Report</h1>

//         <div class="section">
//           <h2><i class="fa fa-calendar-check"></i> Appointment Details</h2>
//           <ul>
//             <li><i class="fa fa-hashtag"></i> <span class="label">Appointment ID:</span> ${
//               appointment.aptID
//             }</li>
//             <li><i class="fa fa-calendar"></i> <span class="label">Date:</span> ${new Date(
//               appointment.date
//             ).toLocaleDateString()}</li>
//             <li><i class="fa fa-clock"></i> <span class="label">Time:</span> ${
//               appointment.time
//             }</li>
//           </ul>
//         </div>

//         <div class="section">
//           <h2><i class="fa fa-user"></i> Patient Details</h2>
//           <ul>
//             <li><i class="fa fa-user"></i> <span class="label">Name:</span> ${
//               patient.name
//             }</li>
//             <li><i class="fa fa-birthday-cake"></i> <span class="label">Age:</span> ${
//               patient.age
//             }</li>
//             <li><i class="fa fa-venus-mars"></i> <span class="label">Gender:</span> ${
//               patient.gender
//             }</li>
//           </ul>
//         </div>

//         <div class="section">
//           <h2><i class="fa fa-tooth"></i> Dentist Details</h2>
//           <ul>
//             <li><i class="fa fa-user-md"></i> <span class="label">Name:</span> ${
//               dentist.name
//             }</li>
//             <li><i class="fa fa-tooth"></i> <span class="label">Specialization:</span> ${
//               dentist.specialization
//             }</li>
//           </ul>
//         </div>

//         <div class="section">
//           <h2><i class="fa fa-file-medical"></i> Report Details</h2>
//           <ul>
//             <li><span class="label">Primary Diagnosis:</span> ${
//               reportDetails.primaryDiagnosis
//             }</li>
//             <li><span class="label">Prescription:</span> ${
//               reportDetails.prescription
//             }</li>
//             <li><span class="label">Procedures Done:</span> ${
//               reportDetails.procedures
//             }</li>
//           </ul>
//         </div>

//         <div class="footer">
//           Report generated on: ${new Date().toLocaleString()}
//         </div>
//       </div>
//     </body>
//   </html>
// `);
//     printWindow.document.close();
//     printWindow.focus();
//     printWindow.print();
//   };

//   const validateForm = () =>
//     reportDetails.primaryDiagnosis &&
//     reportDetails.prescription &&
//     reportDetails.procedures;

//   return (
//     <div
//       className="min-h-screen bg-gradient-to-b from-blue-50 to-teal-100"
//       style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}
//     >
//       <DentistNavbar />
//       <div className="flex justify-center items-start py-12 px-5">
//         <div className="max-w-4xl w-full bg-white rounded-2xl shadow-2xl p-8 space-y-8 border border-gray-300">
//           <h1 className="text-3xl font-extrabold text-teal-700 mb-6 text-center">
//             Patient's Report
//           </h1>

//           {/* Appointment Dropdown */}
//           <div>
//             <label
//               htmlFor="appointment"
//               className="block text-sm font-semibold text-teal-900 mb-1"
//             >
//               Appointment ID
//             </label>
//             <select
//               id="appointment"
//               className="w-full p-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400"
//               value={aptID}
//               onChange={(e) => {
//                 setAptID(e.target.value);
//                 setSearchAptID(e.target.value);
//               }}
//             >
//               <option value="" className="text-gray-400">
//                 Select Appointment ID
//               </option>
//               {appointments.map((apt) => (
//                 <option key={apt.aptID} value={apt.aptID}>
//                   {apt.aptID} - {apt.patientName}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Appointment details */}
//           {appointmentDetails && (
//             <div className="bg-white shadow-xl rounded-xl border border-gray-300 p-6">
//               <h2 className="text-3xl font-extrabold text-teal-700 mb-5">
//                 Appointment Details
//               </h2>
//               <ul className="space-y-5 text-lg text-gray-700">
//                 <li className="flex justify-between items-center">
//                   <span className="flex items-center text-teal-500 font-semibold">
//                     <FaUser className="mr-3" size={20} />
//                     Patient Name:
//                   </span>
//                   <span className="text-teal-900 font-medium">
//                     {appointmentDetails.patient.name}
//                   </span>
//                 </li>
//                 <li className="flex justify-between items-center">
//                   <span className="flex items-center text-teal-500 font-semibold">
//                     <FaBirthdayCake className="mr-3" size={20} />
//                     Age:
//                   </span>
//                   <span className="text-teal-900 font-medium">
//                     {appointmentDetails.patient.age}
//                   </span>
//                 </li>
//                 <li className="flex justify-between items-center">
//                   <span className="flex items-center text-teal-500 font-semibold">
//                     <FaVenusMars className="mr-3" size={20} />
//                     Gender:
//                   </span>
//                   <span className="text-teal-900 font-medium">
//                     {appointmentDetails.patient.gender}
//                   </span>
//                 </li>
//                 <li className="flex justify-between items-center">
//                   <span className="flex items-center text-teal-500 font-semibold">
//                     <FaTooth className="mr-3" size={20} />
//                     Consulted Dentist:
//                   </span>
//                   <span className="text-teal-900 font-medium">
//                     {appointmentDetails.dentist.name}
//                   </span>
//                 </li>
//                 <li className="flex justify-between items-center">
//                   <span className="flex items-center text-teal-500 font-semibold">
//                     <FaCalendarAlt className="mr-3" size={20} />
//                     Date:
//                   </span>
//                   <span className="text-teal-900 font-medium">
//                     {new Date(
//                       appointmentDetails.appointment.date
//                     ).toLocaleDateString()}
//                   </span>
//                 </li>
//                 <li className="flex justify-between items-center">
//                   <span className="flex items-center text-teal-500 font-semibold">
//                     <FaClock className="mr-3" size={20} />
//                     Time:
//                   </span>
//                   <span className="text-teal-900 font-medium">
//                     {appointmentDetails.appointment.time}
//                   </span>
//                 </li>
//               </ul>
//             </div>
//           )}

//           {/* Report form */}
//           {searchAptID && (
//             <form onSubmit={handleReportSubmit} className="space-y-5">
//               <div>
//                 <label
//                   htmlFor="primaryDiagnosis"
//                   className="block text-sm font-extrabold text-teal-900 mb-1"
//                 >
//                   Primary Diagnosis
//                 </label>
//                 <textarea
//                   id="primaryDiagnosis"
//                   value={reportDetails.primaryDiagnosis}
//                   onChange={(e) =>
//                     setReportDetails({
//                       ...reportDetails,
//                       primaryDiagnosis: e.target.value,
//                     })
//                   }
//                   rows={3}
//                   className="w-full p-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-800 placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-teal-400"
//                   placeholder="Enter the primary diagnosis"
//                   required
//                 />
//               </div>

//               <div>
//                 <label
//                   htmlFor="prescription"
//                   className="block text-sm font-extrabold text-teal-900 mb-1"
//                 >
//                   Prescription
//                 </label>
//                 <textarea
//                   id="prescription"
//                   value={reportDetails.prescription}
//                   onChange={(e) =>
//                     setReportDetails({
//                       ...reportDetails,
//                       prescription: e.target.value,
//                     })
//                   }
//                   rows={3}
//                   className="w-full p-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-800 placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-teal-400"
//                   placeholder="Enter the prescription"
//                   required
//                 />
//               </div>

//               <div>
//                 <label
//                   htmlFor="procedures"
//                   className="block text-sm font-extrabold text-teal-900 mb-1"
//                 >
//                   Procedures Done
//                 </label>
//                 <textarea
//                   id="procedures"
//                   value={reportDetails.procedures}
//                   onChange={(e) =>
//                     setReportDetails({
//                       ...reportDetails,
//                       procedures: e.target.value,
//                     })
//                   }
//                   rows={3}
//                   className="w-full p-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-800 placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-teal-400"
//                   placeholder="Enter procedures done"
//                   required
//                 />
//               </div>

//               {error && (
//                 <p className="text-red-600 font-semibold text-center">
//                   {error}
//                 </p>
//               )}

//               <div className="flex justify-between items-center">
//                 <button
//                   type="submit"
//                   disabled={!validateForm()}
//                   className={`px-6 py-3 font-bold rounded-xl text-white shadow-lg transition-colors duration-300
//                     ${
//                       validateForm()
//                         ? "bg-teal-700 hover:bg-teal-900"
//                         : "bg-teal-300 cursor-not-allowed"
//                     }`}
//                 >
//                   {isEditing ? "Update Report" : "Create Report"}
//                 </button>

//                 <button
//                   type="button"
//                   onClick={handlePrint}
//                   className="px-5 py-3 font-semibold rounded-xl text-teal-700 border-2 border-teal-700 hover:bg-teal-700 hover:text-white transition-colors duration-300 shadow-md"
//                   disabled={!isEditing}
//                 >
//                   Print Report
//                 </button>
//               </div>
//             </form>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ReportD;

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";
import {
  FaUser,
  FaCalendarAlt,
  FaClock,
  FaTooth,
  FaVenusMars,
  FaBirthdayCake,
  FaSpinner,
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

  // Loading states
  const [loadingAppointments, setLoadingAppointments] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [loadingReport, setLoadingReport] = useState(false);
  const [submittingReport, setSubmittingReport] = useState(false);

  // Toast IDs to prevent duplicates
  const toastIds = useRef({
    fetchAppointments: null,
    fetchDetails: null,
    fetchReport: null,
    submitReport: null,
  });

  // Fetch all appointments for this dentist on mount or dentistId change
  useEffect(() => {
    if (!dentistId) return;

    const fetchAppointments = async () => {
      setLoadingAppointments(true);
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_API_BASE_URL
          }appointments/getAllAppointmentsByDentistId`,
          { params: { dentistId } }
        );
        const fetchedAppointments = response.data.appointments || [];

        setAppointments(fetchedAppointments);

        if (fetchedAppointments.length === 0) {
          if (!toastIds.current.fetchAppointments) {
            toastIds.current.fetchAppointments = toast.info(
              "You have no appointment history yet.",
              { duration: 4000, id: "fetchAppointments" }
            );
          }
        } else {
          // Clear previous info toast if any
          if (toastIds.current.fetchAppointments) {
            toast.dismiss(toastIds.current.fetchAppointments);
            toastIds.current.fetchAppointments = null;
          }
        }
      } catch (error) {
        if (!toastIds.current.fetchAppointments) {
          toastIds.current.fetchAppointments = toast.error(
            "Something went wrong while loading your appointments.",
            { duration: 4000, id: "fetchAppointments" }
          );
        }
        console.error("Failed to fetch appointments:", error);
      } finally {
        setLoadingAppointments(false);
      }
    };

    fetchAppointments();
  }, [dentistId]);

  // Fetch appointment details when searchAptID changes
  useEffect(() => {
    const fetchAppointmentDetails = async () => {
      if (!searchAptID) {
        setAppointmentDetails(null);
        return;
      }
      setLoadingDetails(true);
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_API_BASE_URL
          }appointments/details/${searchAptID}`
        );

        if (response.data?.details) {
          setAppointmentDetails(response.data.details);

          // Clear previous toast if any
          if (toastIds.current.fetchDetails) {
            toast.dismiss(toastIds.current.fetchDetails);
            toastIds.current.fetchDetails = null;
          }
        } else {
          if (!toastIds.current.fetchDetails) {
            toastIds.current.fetchDetails = toast.info(
              "No details found for the selected appointment.",
              { duration: 4000, id: "fetchDetails" }
            );
          }
          setAppointmentDetails(null);
        }
      } catch (error) {
        if (!toastIds.current.fetchDetails) {
          toastIds.current.fetchDetails = toast.error(
            "Couldn't load appointment details. Please try again.",
            { duration: 4000, id: "fetchDetails" }
          );
        }
        console.error("Failed to fetch appointment details:", error);
      } finally {
        setLoadingDetails(false);
      }
    };

    fetchAppointmentDetails();
  }, [searchAptID]);

  // Fetch report details for selected appointment
  useEffect(() => {
    const fetchReport = async () => {
      if (!searchAptID) {
        setReportDetails({
          primaryDiagnosis: "",
          prescription: "",
          procedures: "",
        });
        setIsEditing(false);
        return;
      }

      setLoadingReport(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}report/get`,
          {
            params: { aptID: searchAptID },
          }
        );
        const { report, message } = response.data;

        if (report) {
          setReportDetails(report);
          setIsEditing(true);

          if (toastIds.current.fetchReport) {
            toast.dismiss(toastIds.current.fetchReport);
            toastIds.current.fetchReport = null;
          }
        } else {
          setReportDetails({
            primaryDiagnosis: "",
            prescription: "",
            procedures: "",
          });
          setIsEditing(false);

          if (!toastIds.current.fetchReport) {
            toastIds.current.fetchReport = toast(
              message || "No report found. Please create one.",
              {
                duration: 4000,
                id: "fetchReport",
              }
            );
          }
        }
      } catch (error) {
        if (!toastIds.current.fetchReport) {
          toastIds.current.fetchReport = toast.error(
            "Unable to fetch report. Please try again.",
            { duration: 4000, id: "fetchReport" }
          );
        }
        console.error("Failed to fetch report:", error);
      } finally {
        setLoadingReport(false);
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

    setError("");
    setSubmittingReport(true);

    try {
      const endpoint = isEditing
        ? `${import.meta.env.VITE_API_BASE_URL}report/update`
        : `${import.meta.env.VITE_API_BASE_URL}report/create`;
      const method = isEditing ? "put" : "post";

      const response = await axios[method](endpoint, {
        aptID: searchAptID,
        primaryDiagnosis: reportDetails.primaryDiagnosis,
        prescription: reportDetails.prescription,
        procedures: reportDetails.procedures,
      });

      toast.success(response.data.message || "Report saved successfully!", {
        duration: 4000,
        id: "submitReport",
      });
      setIsEditing(true);
      setError("");
    } catch (error) {
      toast.error("Failed to save report. Please try again.", {
        duration: 4000,
        id: "submitReport",
      });
      console.error("Failed to save report:", error);
    } finally {
      setSubmittingReport(false);
    }
  };

  const handlePrint = () => {
    if (!reportDetails || !appointmentDetails) {
      toast.error("No complete details available to print.");
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
          font-size: 14px;
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
          font-size: 2rem;
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
          font-size: 1.4rem;
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
          font-size: 1rem;
          line-height: 1.3;
        }
        li:last-child {
          margin-bottom: 0;
        }
        i.fa {
          color: #0f766e;
          min-width: 22px;
          font-size: 16px;
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
            <li><i class="fa fa-id-badge"></i> <span class="label">Name:</span> ${
              patient.fullName
            }</li>
            <li><i class="fa fa-venus-mars"></i> <span class="label">Gender:</span> ${
              patient.gender
            }</li>
            <li><i class="fa fa-birthday-cake"></i> <span class="label">DOB:</span> ${new Date(
              patient.dob
            ).toLocaleDateString()}</li>
          </ul>
        </div>

        <div class="section">
          <h2><i class="fa fa-tooth"></i> Dentist Details</h2>
          <ul>
            <li><i class="fa fa-id-badge"></i> <span class="label">Name:</span> ${
              dentist.fullName
            }</li>
            <li><i class="fa fa-venus-mars"></i> <span class="label">Gender:</span> ${
              dentist.gender
            }</li>
          </ul>
        </div>

        <div class="section">
          <h2><i class="fa fa-notes-medical"></i> Report</h2>
          <ul>
            <li><span class="label">Primary Diagnosis:</span> ${
              reportDetails.primaryDiagnosis
            }</li>
            <li><span class="label">Prescription:</span> ${
              reportDetails.prescription
            }</li>
            <li><span class="label">Procedures:</span> ${
              reportDetails.procedures
            }</li>
          </ul>
        </div>

        <div class="footer">
          Generated by Dentists Management System
        </div>
      </div>
      <script>
        window.print();
        window.onafterprint = function () {
          window.close();
        };
      </script>
    </body>
  </html>
  `);
    printWindow.document.close();
  };

  const validateForm = () => {
    return (
      reportDetails.primaryDiagnosis.trim() !== "" &&
      reportDetails.prescription.trim() !== "" &&
      reportDetails.procedures.trim() !== ""
    );
  };

  return (
    <>
      <DentistNavbar />
      <div className="p-10 max-w-6xl mx-auto bg-white rounded-xl shadow-md">
        <h1 className="text-4xl font-extrabold mb-8 text-center text-teal-700">
          Patient Report
        </h1>

        <div className="mb-6">
          <label
            htmlFor="appointment"
            className="block mb-2 font-semibold text-gray-700"
          >
            Select Appointment:
          </label>
          {loadingAppointments ? (
            <div className="flex items-center gap-2 text-teal-700">
              <FaSpinner className="animate-spin" /> Loading appointments...
            </div>
          ) : (
            <select
              id="appointment"
              className="w-full p-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400"
              value={aptID}
              onChange={(e) => {
                setAptID(e.target.value);
                setSearchAptID(e.target.value);
              }}
              disabled={loadingAppointments || submittingReport}
            >
              <option value="">Select appointment</option>
              {appointments.map((appointment) => (
                <option key={appointment.aptID} value={appointment.aptID}>
                  {appointment.aptID}
                </option>
              ))}
            </select>
          )}
        </div>

        {loadingDetails ? (
          <div className="flex items-center gap-2 text-teal-700 mb-6">
            <FaSpinner className="animate-spin" /> Loading appointment
            details...
          </div>
        ) : appointmentDetails ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 border border-gray-200 p-6 rounded-xl shadow-sm bg-gray-50">
            <div>
              <h2 className="font-semibold text-lg mb-2 flex items-center gap-2 text-teal-600">
                <FaUser /> Patient Details
              </h2>
              <p>
                <strong>Name:</strong> {appointmentDetails.patient.fullName}
              </p>
              <p>
                <strong>Gender:</strong> {appointmentDetails.patient.gender}
              </p>
              <p>
                <strong>DOB:</strong>{" "}
                {new Date(appointmentDetails.patient.dob).toLocaleDateString()}
              </p>
            </div>
            <div>
              <h2 className="font-semibold text-lg mb-2 flex items-center gap-2 text-teal-600">
                <FaCalendarAlt /> Appointment Details
              </h2>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(
                  appointmentDetails.appointment.date
                ).toLocaleDateString()}
              </p>
              <p>
                <strong>Time:</strong> {appointmentDetails.appointment.time}
              </p>
            </div>
            <div>
              <h2 className="font-semibold text-lg mb-2 flex items-center gap-2 text-teal-600">
                <FaTooth /> Dentist Details
              </h2>
              <p>
                <strong>Name:</strong> {appointmentDetails.dentist.fullName}
              </p>
              <p>
                <strong>Gender:</strong> {appointmentDetails.dentist.gender}
              </p>
            </div>
          </div>
        ) : null}

        {(loadingReport || submittingReport) && (
          <div className="flex items-center gap-2 text-teal-700 mb-6">
            <FaSpinner className="animate-spin" />
            {loadingReport
              ? "Loading report..."
              : submittingReport
              ? "Submitting report..."
              : ""}
          </div>
        )}

        <form onSubmit={handleReportSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="primaryDiagnosis"
              className="block mb-2 font-semibold text-gray-700"
            >
              Primary Diagnosis:
            </label>
            <textarea
              id="primaryDiagnosis"
              rows="3"
              className="w-full p-3 border border-gray-300 rounded-xl resize-none bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-400"
              value={reportDetails.primaryDiagnosis}
              onChange={(e) =>
                setReportDetails((prev) => ({
                  ...prev,
                  primaryDiagnosis: e.target.value,
                }))
              }
              disabled={loadingReport || submittingReport}
              placeholder="Enter primary diagnosis"
            />
          </div>

          <div>
            <label
              htmlFor="prescription"
              className="block mb-2 font-semibold text-gray-700"
            >
              Prescription:
            </label>
            <textarea
              id="prescription"
              rows="3"
              className="w-full p-3 border border-gray-300 rounded-xl resize-none bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-400"
              value={reportDetails.prescription}
              onChange={(e) =>
                setReportDetails((prev) => ({
                  ...prev,
                  prescription: e.target.value,
                }))
              }
              disabled={loadingReport || submittingReport}
              placeholder="Enter prescription details"
            />
          </div>

          <div>
            <label
              htmlFor="procedures"
              className="block mb-2 font-semibold text-gray-700"
            >
              Procedures:
            </label>
            <textarea
              id="procedures"
              rows="3"
              className="w-full p-3 border border-gray-300 rounded-xl resize-none bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-400"
              value={reportDetails.procedures}
              onChange={(e) =>
                setReportDetails((prev) => ({
                  ...prev,
                  procedures: e.target.value,
                }))
              }
              disabled={loadingReport || submittingReport}
              placeholder="Enter procedures performed"
            />
          </div>

          {error && (
            <p className="text-red-600 font-semibold text-center">{error}</p>
          )}

          <div className="flex justify-between items-center">
            <button
              type="submit"
              disabled={!validateForm() || submittingReport || loadingReport}
              className={`px-6 py-3 font-bold rounded-xl text-white shadow-lg transition-colors duration-300 ${
                validateForm() && !submittingReport && !loadingReport
                  ? "bg-teal-700 hover:bg-teal-900"
                  : "bg-teal-300 cursor-not-allowed"
              }`}
            >
              {submittingReport ? (
                <span className="flex items-center justify-center gap-2">
                  <FaSpinner className="animate-spin" />
                  Saving...
                </span>
              ) : isEditing ? (
                "Update Report"
              ) : (
                "Create Report"
              )}
            </button>

            <button
              type="button"
              onClick={handlePrint}
              disabled={submittingReport || loadingReport}
              className="px-6 py-3 font-bold rounded-xl text-white bg-teal-600 hover:bg-teal-800 shadow-lg transition-colors duration-300"
            >
              Print Report
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ReportD;
