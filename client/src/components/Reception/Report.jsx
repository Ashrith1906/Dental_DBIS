// import { useState, useEffect } from "react";
// import axios from "axios";
// import ReceptionNavbar from "./ReceptionNavbar";
// import {
//   FaUser,
//   FaCalendarAlt,
//   FaClock,
//   FaTooth,
//   FaVenusMars,
//   FaBirthdayCake,
// } from "react-icons/fa";
// const Report = () => {
//   const [aptID, setAptID] = useState("");
//   const [searchAptID, setSearchAptID] = useState("");
//   const [appointments, setAppointments] = useState([]); // Store fetched appointment data
//   const [appointmentDetails, setAppointmentDetails] = useState(null);
//   const [reportDetails, setReportDetails] = useState({
//     primaryDiagnosis: "",
//     prescription: "",
//     procedures: "",
//   });
//   const [isEditing, setIsEditing] = useState(false);
//   const [error, setError] = useState("");

//   // Fetch all appointments on component mount
//   useEffect(() => {
//     const fetchAppointments = async () => {
//       try {
//         const response = await axios.get(
//           `${import.meta.env.VITE_API_BASE_URL}appointments/getAllAppointments`
//         );
//         setAppointments(response.data.appointment || []); // Store appointments in state
//       } catch (error) {
//         console.error("Failed to fetch appointments:", error);
//         alert("Unable to fetch appointments. Please try again.");
//       }
//     };

//     fetchAppointments();
//   }, []);

//   // Fetch appointment details
//   useEffect(() => {
//     const fetchAppointmentDetails = async () => {
//       if (!searchAptID) return;

//       try {
//         const response = await axios.get(
//           `${
//             import.meta.env.VITE_API_BASE_URL
//           }appointments/details/${searchAptID}`
//         );
//         setAppointmentDetails(response.data.details);
//       } catch (error) {
//         console.error("Failed to fetch appointment details:", error);
//         alert("Unable to fetch appointment details. Please try again.");
//       }
//     };

//     fetchAppointmentDetails();
//   }, [searchAptID]);

//   // Fetch report details
//   const fetchReport = async () => {
//     if (!searchAptID) return;

//     try {
//       const response = await axios.get(
//         `${import.meta.env.VITE_API_BASE_URL}report/get`,
//         {
//           params: { aptID: searchAptID },
//         }
//       );
//       const { report, message } = response.data;

//       if (report) {
//         setReportDetails(report);
//         setIsEditing(true); // If report exists, set editing to true
//       } else {
//         alert(message || "No report found. Please create one.");
//         setReportDetails({
//           primaryDiagnosis: "",
//           prescription: "",
//           procedures: "",
//         });
//         setIsEditing(false); // If no report exists, it's create mode
//       }
//     } catch (error) {
//       console.error("Failed to fetch report:", error);
//       alert("Unable to fetch report. Please try again.");
//     }
//   };

//   useEffect(() => {
//     fetchReport(); // Call fetchReport when searchAptID changes
//   }, [searchAptID]);

//   const handleReportSubmit = async (e) => {
//     e.preventDefault();

//     // Validate that all fields are filled
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
//         : `${import.meta.env.VITE_API_BASE_URL}report/create`; // Set the correct endpoint for creating or updating
//       const method = isEditing ? "put" : "post"; // Use PUT if updating, POST if creating
//       const response = await axios[method](endpoint, {
//         aptID: searchAptID,
//         primaryDiagnosis: reportDetails.primaryDiagnosis,
//         prescription: reportDetails.prescription,
//         procedures: reportDetails.procedures,
//       });

//       alert(response.data.message || "Report saved successfully!");

//       // After successful creation or update, fetch the latest report to display
//       fetchReport(); // This will reload the report details from the server

//       setIsEditing(true); // Set editing mode after creation
//       setError(""); // Clear any errors
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
//             /* You can adjust the style as needed */
//             body {
//               font-family: Arial, sans-serif;
//               padding: 20px;
//               color: #333;
//               background-color: #f9f9f9;
//             }
//             .container {
//               width: 80%;
//               margin: 0 auto;
//               padding: 20px;
//               border: 1px solid #ddd;
//               border-radius: 10px;
//               background-color: #fff;
//             }
//             h1, h2 {
//               text-align: center;
//               color: #007bff;
//             }
//             .section {
//               margin-bottom: 20px;
//             }
//             .section ul {
//               list-style-type: none;
//               padding: 0;
//             }
//             .section li {
//               margin-bottom: 10px;
//             }
//             .section li span {
//               font-weight: bold;
//             }
//             .table {
//               width: 100%;
//               border-collapse: collapse;
//               margin-top: 20px;
//             }
//             .table th, .table td {
//               padding: 8px;
//               border: 1px solid #ddd;
//               text-align: left;
//             }
//             .total {
//               font-size: 18px;
//               font-weight: bold;
//               text-align: right;
//             }
//           </style>
//         </head>
//         <body>
//           <div class="container">
//             <h1>Report - Appointment ID: ${searchAptID}</h1>

//             <!-- Appointment Details -->
//             <div class="section">
//               <h2>Appointment Details</h2>
//               <ul>
//                 <li><span>Appointment ID:</span> ${appointment.aptID}</li>
//                 <li><span>Date:</span> ${new Date(
//                   appointment.date
//                 ).toLocaleDateString()}</li>
//                 <li><span>Time:</span> ${appointment.time}</li>
//               </ul>
//             </div>

//             <!-- Patient Details -->
//             <div class="section">
//               <h2>Patient Details</h2>
//               <ul>
//                 <li><span>Name:</span> ${patient.name}</li>
//                 <li><span>Age:</span> ${patient.age}</li>
//                 <li><span>Gender:</span> ${patient.gender}</li>
//               </ul>
//             </div>

//             <!-- Dentist Details -->
//             <div class="section">
//               <h2>Dentist Details</h2>
//               <ul>
//                 <li><span>Name:</span> ${dentist.name}</li>
//                 <li><span>Specialization:</span> ${dentist.specialization}</li>
//               </ul>
//             </div>

//             <!-- Report Details -->
//             <div class="section">
//               <h2>Report Details</h2>
//               <ul>
//                 <li><span>Primary Diagnosis:</span> ${
//                   reportDetails.primaryDiagnosis
//                 }</li>
//                 <li><span>Prescription:</span> ${
//                   reportDetails.prescription
//                 }</li>
//                 <li><span>Procedures:</span> ${reportDetails.procedures}</li>
//               </ul>
//             </div>

//             <!-- Footer -->
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

//   const validateForm = () => {
//     return (
//       reportDetails.primaryDiagnosis &&
//       reportDetails.prescription &&
//       reportDetails.procedures
//     );
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-100">
//       <ReceptionNavbar />
//       <div className="flex justify-center items-start pt-10 px-5">
//         <div className="w-full max-w-4xl bg-white p-8 rounded-2xl shadow-2xl border border-gray-300">
//           <h1 className="text-3xl font-extrabold text-teal-700 mb-6">
//             Patient Report
//           </h1>

//           {/* Appointment ID Dropdown */}
//           <div className="mb-6">
//             <label
//               htmlFor="appointment"
//               className="block text-sm font-semibold text-teal-900 mb-2"
//             >
//               Appointment ID
//             </label>
//             <select
//               id="appointment"
//               className="w-full mt-1 p-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
//               value={aptID}
//               onChange={(e) => {
//                 setAptID(e.target.value);
//                 setSearchAptID(e.target.value);
//               }}
//             >
//               <option value="">Select Appointment ID</option>
//               {appointments.map((apt) => (
//                 <option key={apt.aptID} value={apt.aptID}>
//                   {apt.aptID}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Appointment Details */}
//           {appointmentDetails && (
//             <div className="mb-8">
//               <div className="bg-white rounded-2xl shadow-xl border border-gray-200">
//                 <div className="p-6">
//                   <h2 className="text-3xl font-extrabold text-teal-700 mb-4">
//                     Appointment Details
//                   </h2>
//                   <ul className="space-y-5 text-base text-gray-700">
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
//                         {new Date(
//                           appointmentDetails.appointment.date
//                         ).toLocaleDateString()}
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

//           {/* Report Form */}
//           {reportDetails ? (
//             <form onSubmit={handleReportSubmit} className="space-y-5">
//               <div>
//                 <label className="block text-sm font-medium text-teal-900 mb-2">
//                   Primary Diagnosis
//                 </label>
//                 <textarea
//                   name="primaryDiagnosis"
//                   value={reportDetails.primaryDiagnosis}
//                   onChange={(e) =>
//                     setReportDetails({
//                       ...reportDetails,
//                       primaryDiagnosis: e.target.value,
//                     })
//                   }
//                   className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
//                   required
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-teal-900 mb-2">
//                   Prescription
//                 </label>
//                 <textarea
//                   name="prescription"
//                   value={reportDetails.prescription}
//                   onChange={(e) =>
//                     setReportDetails({
//                       ...reportDetails,
//                       prescription: e.target.value,
//                     })
//                   }
//                   className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
//                   required
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-teal-900 mb-2">
//                   Procedures
//                 </label>
//                 <textarea
//                   name="procedures"
//                   value={reportDetails.procedures}
//                   onChange={(e) =>
//                     setReportDetails({
//                       ...reportDetails,
//                       procedures: e.target.value,
//                     })
//                   }
//                   className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
//                   required
//                 />
//               </div>

//               {error && <p className="text-red-600 text-sm">{error}</p>}

//               <div className="flex justify-between mt-6">
//                 <button
//                   type="submit"
//                   disabled={!validateForm()}
//                   className="w-full max-w-[200px] bg-teal-500 hover:bg-teal-600 text-white text-base font-semibold py-3 rounded-xl shadow-md disabled:opacity-50 transition"
//                 >
//                   {isEditing ? "Update Report" : "Create Report"}
//                 </button>
//                 <button
//                   type="button"
//                   onClick={handlePrint}
//                   className="w-full max-w-[200px] bg-teal-500 hover:bg-teal-600 text-white text-base font-semibold py-3 rounded-xl shadow-md transition"
//                 >
//                   Print Report
//                 </button>
//               </div>
//             </form>
//           ) : (
//             <p className="text-teal-700 text-base mt-6">No report available.</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Report;

import { useState, useEffect } from "react";
import axios from "axios";
import ReceptionNavbar from "./ReceptionNavbar";
import { toast } from "react-hot-toast";
import {
  FaUser,
  FaCalendarAlt,
  FaClock,
  FaTooth,
  FaVenusMars,
  FaBirthdayCake,
} from "react-icons/fa";

const Report = () => {
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Loading states for data fetching
  const [loadingAppointments, setLoadingAppointments] = useState(false);
  const [loadingAppointmentDetails, setLoadingAppointmentDetails] =
    useState(false);
  const [loadingReport, setLoadingReport] = useState(false);

  // Toast IDs to prevent duplicates
  const toastIds = {
    fetchAppointments: "fetchAppointmentsToast",
    fetchAppointmentDetails: "fetchAppointmentDetailsToast",
    fetchReport: "fetchReportToast",
    submitReport: "submitReportToast",
  };

  // Fetch all appointments on mount
  useEffect(() => {
    const fetchAppointments = async () => {
      setLoadingAppointments(true);
      toast.dismiss(toastIds.fetchAppointments);
      toast.loading("Fetching appointments...", {
        id: toastIds.fetchAppointments,
      });

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}appointments/getAllAppointments`
        );
        setAppointments(response.data.appointment || []);
        toast.success("Appointments loaded", {
          id: toastIds.fetchAppointments,
        });
      } catch (error) {
        console.error("Failed to fetch appointments:", error);
        toast.error("Failed to load appointments", {
          id: toastIds.fetchAppointments,
        });
      } finally {
        setLoadingAppointments(false);
      }
    };

    fetchAppointments();
  }, []);

  // Fetch appointment details when searchAptID changes
  useEffect(() => {
    const fetchAppointmentDetails = async () => {
      if (!searchAptID) {
        setAppointmentDetails(null);
        return;
      }

      setLoadingAppointmentDetails(true);
      toast.dismiss(toastIds.fetchAppointmentDetails);
      toast.loading("Loading appointment details...", {
        id: toastIds.fetchAppointmentDetails,
      });

      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_API_BASE_URL
          }appointments/details/${searchAptID}`
        );
        setAppointmentDetails(response.data.details);
        toast.success("Appointment details loaded", {
          id: toastIds.fetchAppointmentDetails,
        });
      } catch (error) {
        console.error("Failed to fetch appointment details:", error);
        setAppointmentDetails(null);
        toast.error("Unable to load appointment details", {
          id: toastIds.fetchAppointmentDetails,
        });
      } finally {
        setLoadingAppointmentDetails(false);
      }
    };

    fetchAppointmentDetails();
  }, [searchAptID]);

  // Fetch report when searchAptID changes
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
      toast.dismiss(toastIds.fetchReport);
      toast.loading("Fetching report...", { id: toastIds.fetchReport });

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}report/get`,
          { params: { aptID: searchAptID } }
        );

        const { report } = response.data;

        if (report) {
          setReportDetails(report);
          setIsEditing(true);
          toast.success("Report loaded", { id: toastIds.fetchReport });
        } else {
          setReportDetails({
            primaryDiagnosis: "",
            prescription: "",
            procedures: "",
          });
          setIsEditing(false);
          toast.dismiss(toastIds.fetchReport);
          toast("No report found. Please create one.");
        }
      } catch (error) {
        toast.error("Unable to fetch report", { id: toastIds.fetchReport });
      } finally {
        setLoadingReport(false);
      }
    };

    fetchReport();
  }, [searchAptID]);

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
    setIsSubmitting(true);

    const endpoint = isEditing
      ? `${import.meta.env.VITE_API_BASE_URL}report/update`
      : `${import.meta.env.VITE_API_BASE_URL}report/create`;
    const method = isEditing ? "put" : "post";

    const promise = axios[method](endpoint, {
      aptID: searchAptID,
      primaryDiagnosis: reportDetails.primaryDiagnosis,
      prescription: reportDetails.prescription,
      procedures: reportDetails.procedures,
    });

    toast.dismiss(toastIds.submitReport);
    toast.loading(isEditing ? "Updating report..." : "Creating report...", {
      id: toastIds.submitReport,
    });

    try {
      const res = await promise;
      toast.success(res.data.message || "Report saved successfully!", {
        id: toastIds.submitReport,
      });
      await fetchLatestReport();
      setIsEditing(true);
    } catch (error) {
      console.error("Failed to save report:", error);
      toast.error("Failed to save report. Please try again.", {
        id: toastIds.submitReport,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to fetch report (for refresh after save)
  const fetchLatestReport = async () => {
    if (!searchAptID) return;

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}report/get`,
        { params: { aptID: searchAptID } }
      );
      const { report } = response.data;
      if (report) {
        setReportDetails(report);
        setIsEditing(true);
      }
    } catch (error) {
      console.error("Failed to refresh report after save:", error);
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
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
              color: #333;
              background-color: #f9f9f9;
            }
            .container {
              width: 80%;
              margin: 0 auto;
              padding: 20px;
              border: 1px solid #ddd;
              border-radius: 10px;
              background-color: #fff;
            }
            h1, h2 {
              text-align: center;
              color: #007bff;
            }
            .section {
              margin-bottom: 20px;
            }
            .section ul {
              list-style-type: none;
              padding: 0;
            }
            .section li {
              margin-bottom: 10px;
            }
            .section li span {
              font-weight: bold;
            }
            .table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            .table th, .table td {
              padding: 8px;
              border: 1px solid #ddd;
              text-align: left;
            }
            .total {
              font-size: 18px;
              font-weight: bold;
              text-align: right;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Report - Appointment ID: ${searchAptID}</h1>
            
            <div class="section">
              <h2>Appointment Details</h2>
              <ul>
                <li><span>Appointment ID:</span> ${appointment.aptID}</li>
                <li><span>Date:</span> ${new Date(
                  appointment.date
                ).toLocaleDateString()}</li>
                <li><span>Time:</span> ${appointment.time}</li>
              </ul>
            </div>

            <div class="section">
              <h2>Patient Details</h2>
              <ul>
                <li><span>Name:</span> ${patient.name}</li>
                <li><span>Age:</span> ${patient.age}</li>
                <li><span>Gender:</span> ${patient.gender}</li>
              </ul>
            </div>

            <div class="section">
              <h2>Dentist Details</h2>
              <ul>
                <li><span>Name:</span> ${dentist.name}</li>
                <li><span>Specialization:</span> ${dentist.specialization}</li>
              </ul>
            </div>

            <div class="section">
              <h2>Report Details</h2>
              <ul>
                <li><span>Primary Diagnosis:</span> ${
                  reportDetails.primaryDiagnosis
                }</li>
                <li><span>Prescription:</span> ${
                  reportDetails.prescription
                }</li>
                <li><span>Procedures:</span> ${reportDetails.procedures}</li>
              </ul>
            </div>

            <div class="text-center mt-12">
              <p>Generated on: ${new Date().toLocaleString()}</p>
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-100">
      <ReceptionNavbar />
      <div className="flex justify-center items-start pt-10 px-5">
        <div className="w-full max-w-4xl bg-white p-8 rounded-2xl shadow-2xl border border-gray-300">
          <h1 className="text-3xl font-extrabold text-teal-700 mb-6">
            Patient Report
          </h1>

          {/* Appointment ID Dropdown */}
          <div className="mb-6">
            <label
              htmlFor="appointment"
              className="block text-sm font-semibold text-teal-900 mb-2"
            >
              Appointment ID
            </label>
            {loadingAppointments ? (
              <div className="flex justify-center py-3">
                <svg
                  className="animate-spin h-6 w-6 text-teal-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  ></path>
                </svg>
              </div>
            ) : (
              <select
                id="appointment"
                className="w-full mt-1 p-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
                value={aptID}
                onChange={(e) => {
                  setAptID(e.target.value);
                  setSearchAptID(e.target.value);
                }}
              >
                <option value="">Select Appointment ID</option>
                {appointments.map((apt) => (
                  <option key={apt.aptID} value={apt.aptID}>
                    {apt.aptID}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Appointment Details */}
          {loadingAppointmentDetails ? (
            <div className="flex justify-center py-8 text-teal-600">
              <svg
                className="animate-spin h-10 w-10"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                ></path>
              </svg>
            </div>
          ) : (
            appointmentDetails && (
              <div className="mb-8">
                <div className="bg-white rounded-2xl shadow-xl p-6 text-teal-900">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <FaUser className="text-teal-500" />
                      <span className="font-semibold">
                        {appointmentDetails.patient.name}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FaVenusMars className="text-teal-500" />
                      <span>{appointmentDetails.patient.gender}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FaBirthdayCake className="text-teal-500" />
                      <span>{appointmentDetails.patient.age} years</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FaCalendarAlt className="text-teal-500" />
                      <span>
                        {new Date(
                          appointmentDetails.appointment.date
                        ).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FaClock className="text-teal-500" />
                      <span>{appointmentDetails.appointment.time}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FaTooth className="text-teal-500" />
                      <span>{appointmentDetails.dentist.name}</span>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}

          {/* Report Form */}
          <form onSubmit={handleReportSubmit} className="space-y-6 mb-6">
            <div>
              <label
                className="block font-semibold text-teal-900 mb-2"
                htmlFor="primaryDiagnosis"
              >
                Primary Diagnosis
              </label>
              <textarea
                id="primaryDiagnosis"
                rows="3"
                value={reportDetails.primaryDiagnosis}
                onChange={(e) =>
                  setReportDetails({
                    ...reportDetails,
                    primaryDiagnosis: e.target.value,
                  })
                }
                className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-teal-400"
                disabled={loadingReport}
              />
            </div>
            <div>
              <label
                className="block font-semibold text-teal-900 mb-2"
                htmlFor="prescription"
              >
                Prescription
              </label>
              <textarea
                id="prescription"
                rows="3"
                value={reportDetails.prescription}
                onChange={(e) =>
                  setReportDetails({
                    ...reportDetails,
                    prescription: e.target.value,
                  })
                }
                className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-teal-400"
                disabled={loadingReport}
              />
            </div>
            <div>
              <label
                className="block font-semibold text-teal-900 mb-2"
                htmlFor="procedures"
              >
                Procedures
              </label>
              <textarea
                id="procedures"
                rows="3"
                value={reportDetails.procedures}
                onChange={(e) =>
                  setReportDetails({
                    ...reportDetails,
                    procedures: e.target.value,
                  })
                }
                className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-teal-400"
                disabled={loadingReport}
              />
            </div>

            {error && <p className="text-red-600 font-semibold">{error}</p>}

            <button
              type="submit"
              disabled={!validateForm() || isSubmitting || loadingReport}
              className={`w-full py-3 rounded-xl text-white font-semibold transition ${
                !validateForm() || isSubmitting || loadingReport
                  ? "bg-teal-300 cursor-not-allowed"
                  : "bg-teal-600 hover:bg-teal-700"
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center space-x-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    ></path>
                  </svg>
                  <span>{isEditing ? "Updating..." : "Creating..."}</span>
                </span>
              ) : loadingReport ? (
                <span className="flex items-center justify-center space-x-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    ></path>
                  </svg>
                  <span>Loading...</span>
                </span>
              ) : isEditing ? (
                "Update Report"
              ) : (
                "Create Report"
              )}
            </button>
          </form>

          {/* Print Button */}
          <button
            onClick={handlePrint}
            className="w-full py-3 rounded-xl bg-teal-500 text-white font-semibold hover:bg-teal-600 transition"
            disabled={loadingReport || isSubmitting}
          >
            Print Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default Report;
