// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useAuth } from "../contexts/AuthContext";
// import {
//   FaUser,
//   FaBirthdayCake,
//   FaVenusMars,
//   FaTooth,
//   FaCalendarAlt,
//   FaClock,
// } from "react-icons/fa";
// import Navbar from "./PatientNavbar";

// const PatientReport = () => {
//   const { patientId } = useAuth();
//   const [aptIds, setAptIds] = useState([]);
//   const [selectedAptID, setSelectedAptID] = useState("");
//   const [appointmentDetails, setAppointmentDetails] = useState(null);
//   const [reportDetails, setReportDetails] = useState(null);

//   useEffect(() => {
//     const fetchAppointmentIDs = async () => {
//       if (!patientId) return;
//       try {
//         const res = await axios.get(
//           `${import.meta.env.VITE_API_BASE_URL}appointments/getAllAppointmentsByPID`,
//           {
//             params: { pID: patientId },
//           }
//         );
//         const ids = res.data.appointment.map((apt) => apt.aptID);
//         setAptIds(ids);
//       } catch (err) {
//         console.error("Error fetching appointment IDs", err);
//       }
//     };

//     fetchAppointmentIDs();
//   }, [patientId]);

//   useEffect(() => {
//     if (!selectedAptID) return;
//     const fetchDetails = async () => {
//       try {
//         const [aptRes, reportRes] = await Promise.all([
//           axios.get(
//             `${
//               import.meta.env.VITE_API_BASE_URL
//             }appointments/details/${selectedAptID}`
//           ),
//           axios.get(`${import.meta.env.VITE_API_BASE_URL}report/get`, {
//             params: { aptID: selectedAptID },
//           }),
//         ]);
//         setAppointmentDetails(aptRes.data.details);
//         setReportDetails(reportRes.data.report);
//       } catch (error) {
//         console.error("Error fetching appointment or report", error);
//         setAppointmentDetails(null);
//         setReportDetails(null);
//       }
//     };

//     fetchDetails();
//   }, [selectedAptID]);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-100">
//       <Navbar />
//       <div className="max-w-3xl mx-auto p-8">
//         <h2 className="text-3xl font-extrabold text-teal-700 text-center mb-6">
//           Your Appointment Reports
//         </h2>

//         {/* Appointment Dropdown */}
//         <div className="mb-6 border p-6 rounded-2xl shadow-xl bg-white">
//           <label className="block text-sm font-semibold text-teal-900 mb-2">
//             Select Appointment
//           </label>
//           <select
//             className="w-full p-3 rounded-xl bg-gray-50 border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-400"
//             value={selectedAptID}
//             onChange={(e) => setSelectedAptID(e.target.value)}
//           >
//             <option value="">-- Select Appointment --</option>
//             {aptIds.map((aptID) => (
//               <option key={aptID} value={aptID}>
//                 {aptID}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Appointment Details */}
//         {appointmentDetails && (
//           <div className="bg-white p-6 rounded-2xl shadow-xl mb-6">
//             <h3 className="text-xl font-semibold text-teal-700 mb-4">
//               Appointment Details
//             </h3>
//             <ul className="space-y-2 text-gray-600">
//               <li>
//                 <FaUser className="inline text-teal-500 mr-2" />{" "}
//                 {appointmentDetails.patient.name}
//               </li>
//               <li>
//                 <FaBirthdayCake className="inline text-teal-500 mr-2" /> Age:{" "}
//                 {appointmentDetails.patient.age}
//               </li>
//               <li>
//                 <FaVenusMars className="inline text-teal-500 mr-2" /> Gender:{" "}
//                 {appointmentDetails.patient.gender}
//               </li>
//               <li>
//                 <FaTooth className="inline text-teal-500 mr-2" /> Dentist:{" "}
//                 {appointmentDetails.dentist.name}
//               </li>
//               <li>
//                 <FaCalendarAlt className="inline text-teal-500 mr-2" /> Date:{" "}
//                 {new Date(
//                   appointmentDetails.appointment.date
//                 ).toLocaleDateString()}
//               </li>
//               <li>
//                 <FaClock className="inline text-teal-500 mr-2" /> Time:{" "}
//                 {appointmentDetails.appointment.time}
//               </li>
//             </ul>
//           </div>
//         )}

//         {/* Report Section */}
//         {reportDetails ? (
//           <div className="bg-white p-6 rounded-2xl shadow-2xl">
//             <h3 className="text-xl font-semibold text-teal-700 mb-4">
//               Report Details
//             </h3>

//             <div className="mb-4">
//               <label className="block text-sm font-medium text-teal-900 mb-1">
//                 Primary Diagnosis
//               </label>
//               <textarea
//                 readOnly
//                 className="w-full bg-gray-50 p-3 rounded-xl border border-gray-300 text-gray-700"
//                 value={reportDetails.primaryDiagnosis}
//               ></textarea>
//             </div>

//             <div className="mb-4">
//               <label className="block text-sm font-medium text-teal-900 mb-1">
//                 Prescription
//               </label>
//               <textarea
//                 readOnly
//                 className="w-full bg-gray-50 p-3 rounded-xl border border-gray-300 text-gray-700"
//                 value={reportDetails.prescription}
//               ></textarea>
//             </div>

//             <div className="mb-4">
//               <label className="block text-sm font-medium text-teal-900 mb-1">
//                 Procedures
//               </label>
//               <textarea
//                 readOnly
//                 className="w-full bg-gray-50 p-3 rounded-xl border border-gray-300 text-gray-700"
//                 value={reportDetails.procedures}
//               ></textarea>
//             </div>

//             <div className="flex justify-center mt-6">
//               <button
//                 onClick={() => window.print()}
//                 className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-6 rounded-xl shadow-md transition"
//               >
//                 Print Report
//               </button>
//             </div>
//           </div>
//         ) : (
//           selectedAptID && (
//             <p className="text-red-600 font-semibold text-center mt-4">
//               Report not yet uploaded. Please wait until your dentist submits it.
//             </p>
//           )
//         )}
//       </div>
//     </div>
//   );
// };

// export default PatientReport;

import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import {
  FaUser,
  FaBirthdayCake,
  FaVenusMars,
  FaTooth,
  FaCalendarAlt,
  FaClock,
} from "react-icons/fa";
import Navbar from "./PatientNavbar";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

const PatientReport = () => {
  const { patientId } = useAuth();
  const [aptIds, setAptIds] = useState([]);
  const [selectedAptID, setSelectedAptID] = useState("");
  const [appointmentDetails, setAppointmentDetails] = useState(null);
  const [reportDetails, setReportDetails] = useState(null);
  const [loadingAptIds, setLoadingAptIds] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    const fetchAppointmentIDs = async () => {
      if (!patientId) return;
      setLoadingAptIds(true);
      try {
        const res = await axios.get(
          `${
            import.meta.env.VITE_API_BASE_URL
          }appointments/getAllAppointmentsByPID`,
          {
            params: { pID: patientId },
          }
        );
        const ids = res.data.appointment.map((apt) => apt.aptID);
        setAptIds(ids);
      } catch (err) {
        toast.error("Error fetching appointment IDs");
        console.error("Error fetching appointment IDs", err);
      } finally {
        setLoadingAptIds(false);
      }
    };

    fetchAppointmentIDs();
  }, [patientId]);

  useEffect(() => {
    if (!selectedAptID) return;
    const fetchDetails = async () => {
      setLoadingDetails(true);
      try {
        const [aptRes, reportRes] = await Promise.all([
          axios.get(
            `${
              import.meta.env.VITE_API_BASE_URL
            }appointments/details/${selectedAptID}`
          ),
          axios.get(`${import.meta.env.VITE_API_BASE_URL}report/get`, {
            params: { aptID: selectedAptID },
          }),
        ]);
        setAppointmentDetails(aptRes.data.details);
        setReportDetails(reportRes.data.report);
      } catch (error) {
        console.error("Error fetching appointment or report", error);
        toast.error("Failed to fetch report or appointment details");
        setAppointmentDetails(null);
        setReportDetails(null);
      } finally {
        setLoadingDetails(false);
      }
    };

    fetchDetails();
  }, [selectedAptID]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-100">
      <Navbar />
      <div className="max-w-3xl mx-auto p-8">
        <h2 className="text-3xl font-extrabold text-teal-700 text-center mb-6">
          Your Appointment Reports
        </h2>

        {/* Appointment Dropdown */}
        <div className="mb-6 border p-6 rounded-2xl shadow-xl bg-white">
          <label className="block text-sm font-semibold text-teal-900 mb-2">
            Select Appointment
          </label>
          {loadingAptIds ? (
            <div className="flex justify-center">
              <Loader2 className="animate-spin text-teal-600" size={24} />
            </div>
          ) : (
            <select
              className="w-full p-3 rounded-xl bg-gray-50 border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-400"
              value={selectedAptID}
              onChange={(e) => setSelectedAptID(e.target.value)}
            >
              <option value="">-- Select Appointment --</option>
              {aptIds.map((aptID) => (
                <option key={aptID} value={aptID}>
                  {aptID}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Appointment Details */}
        {loadingDetails ? (
          <div className="flex justify-center items-center h-32">
            <Loader2 className="animate-spin text-teal-600" size={28} />
          </div>
        ) : (
          appointmentDetails && (
            <div className="bg-white p-6 rounded-2xl shadow-xl mb-6">
              <h3 className="text-xl font-semibold text-teal-700 mb-4">
                Appointment Details
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <FaUser className="inline text-teal-500 mr-2" />{" "}
                  {appointmentDetails.patient.name}
                </li>
                <li>
                  <FaBirthdayCake className="inline text-teal-500 mr-2" /> Age:{" "}
                  {appointmentDetails.patient.age}
                </li>
                <li>
                  <FaVenusMars className="inline text-teal-500 mr-2" /> Gender:{" "}
                  {appointmentDetails.patient.gender}
                </li>
                <li>
                  <FaTooth className="inline text-teal-500 mr-2" /> Dentist:{" "}
                  {appointmentDetails.dentist.name}
                </li>
                <li>
                  <FaCalendarAlt className="inline text-teal-500 mr-2" /> Date:{" "}
                  {new Date(
                    appointmentDetails.appointment.date
                  ).toLocaleDateString()}
                </li>
                <li>
                  <FaClock className="inline text-teal-500 mr-2" /> Time:{" "}
                  {appointmentDetails.appointment.time}
                </li>
              </ul>
            </div>
          )
        )}

        {/* Report Section */}
        {loadingDetails ? null : reportDetails ? (
          <div className="bg-white p-6 rounded-2xl shadow-2xl">
            <h3 className="text-xl font-semibold text-teal-700 mb-4">
              Report Details
            </h3>

            <div className="mb-4">
              <label className="block text-sm font-medium text-teal-900 mb-1">
                Primary Diagnosis
              </label>
              <textarea
                readOnly
                className="w-full bg-gray-50 p-3 rounded-xl border border-gray-300 text-gray-700"
                value={reportDetails.primaryDiagnosis}
              ></textarea>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-teal-900 mb-1">
                Prescription
              </label>
              <textarea
                readOnly
                className="w-full bg-gray-50 p-3 rounded-xl border border-gray-300 text-gray-700"
                value={reportDetails.prescription}
              ></textarea>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-teal-900 mb-1">
                Procedures
              </label>
              <textarea
                readOnly
                className="w-full bg-gray-50 p-3 rounded-xl border border-gray-300 text-gray-700"
                value={reportDetails.procedures}
              ></textarea>
            </div>

            <div className="flex justify-center mt-6">
              <button
                onClick={() => window.print()}
                className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-6 rounded-xl shadow-md transition"
              >
                Print Report
              </button>
            </div>
          </div>
        ) : (
          selectedAptID && (
            <p className="text-red-600 font-semibold text-center mt-4">
              Report not yet uploaded. Please wait until your dentist submits
              it.
            </p>
          )
        )}
      </div>
    </div>
  );
};

export default PatientReport;
