// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useAuth } from "../contexts/AuthContext";
// import DentistNavbar from "./DentistNavbar";
// import {
//   FaCalendarAlt,
//   FaClock,
//   FaUser,
//   FaClipboard,
//   FaCheckCircle,
//   FaTimesCircle,
// } from "react-icons/fa";
// import toast from "react-hot-toast";
// import { Loader2 } from "lucide-react";
// import Footer from "../Footer";

// const Dentist = () => {
//   const { dentistId } = useAuth();
//   const [appointments, setAppointments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [dentistName, setDentistName] = useState("");

//   useEffect(() => {
//     const fetchDentistProfile = async () => {
//       if (!dentistId) {
//         toast.error("Dentist ID is not available.");
//         setLoading(false);
//         return;
//       }

//       try {
//         const response = await axios.get(
//           `${import.meta.env.VITE_API_BASE_URL}profiles/dentist`,
//           { params: { dentistId } }
//         );
//         if (response.data && response.data.dentist) {
//           setDentistName(response.data.dentist.name);
//         }
//       } catch {
//         toast.error("Failed to fetch dentist profile.");
//       }
//     };

//     fetchDentistProfile();
//   }, [dentistId]);

//   useEffect(() => {
//     const fetchAppointments = async () => {
//       if (!dentistId) {
//         toast.error("Dentist ID is not available.");
//         setLoading(false);
//         return;
//       }

//       try {
//         const response = await axios.get(
//           `${
//             import.meta.env.VITE_API_BASE_URL
//           }appointments/getAllAppointmentsByDentistID?dentistId=${dentistId}`
//         );
//         setAppointments(response.data.appointments || []);
//       } catch {
//         toast.error("Failed to fetch appointments.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAppointments();
//   }, [dentistId]);

//   const getISTDate = (dateString) => {
//     const date = new Date(dateString);
//     return new Date(date.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
//   };

//   const pastAppointments = appointments.filter((apt) => {
//     const aptDateTimeStr = new Date(
//       `${apt.apt_date.split("T")[0]}T${apt.apt_time}:00`
//     );
//     const aptDateTimeIST = getISTDate(aptDateTimeStr);
//     const currentDateTimeIST = getISTDate(new Date());
//     return aptDateTimeIST < currentDateTimeIST;
//   });

//   const upcomingAppointments = appointments.filter((apt) => {
//     const aptDateTimeStr = new Date(
//       `${apt.apt_date.split("T")[0]}T${apt.apt_time}:00`
//     );
//     const aptDateTimeIST = getISTDate(aptDateTimeStr);
//     const currentDateTimeIST = getISTDate(new Date());
//     return aptDateTimeIST >= currentDateTimeIST;
//   });

//   const renderAppointments = (appointments) => (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
//       {appointments.map((apt) => (
//         <div
//           key={apt._id}
//           className="bg-white shadow-md rounded-lg p-6 hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-2"
//         >
//           <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
//             <FaClipboard className="text-gray-500 mr-2" />
//             Appointment ID: {apt.aptID}
//           </h3>
//           <p className="text-gray-600 flex items-center">
//             <FaCalendarAlt className="text-blue-500 mr-2" />
//             <strong>Date: </strong>{" "}
//             {new Date(apt.apt_date).toLocaleDateString()}
//           </p>
//           <p className="text-gray-600 flex items-center">
//             <FaClock className="text-green-500 mr-2" />
//             <strong>Time: </strong> {apt.apt_time}
//           </p>
//           <p className="text-gray-600 flex items-center">
//             <FaUser className="text-yellow-500 mr-2" />
//             <strong>Patient Name: </strong> {apt.patientName}
//           </p>
//           <p className="text-gray-600 flex items-center">
//             <FaClipboard className="text-gray-500 mr-2" />
//             <strong>Reason: </strong> {apt.reason}
//           </p>
//           <p className="text-gray-600 flex items-center">
//             {apt.status === "booked" ? (
//               <>
//                 <FaCheckCircle className="text-green-500 mr-2" />
//                 <strong>Status: </strong> {apt.status}
//               </>
//             ) : (
//               <>
//                 <FaTimesCircle className="text-red-500 mr-2" />
//                 <strong>Status: </strong> {apt.status}
//               </>
//             )}
//           </p>
//         </div>
//       ))}
//     </div>
//   );

//   if (loading) {
//     return (
//       <>
//         <DentistNavbar />
//         <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-teal-100">
//           <Loader2 className="h-6 w-6 animate-spin text-teal-600" />
//         </div>
//       </>
//     );
//   }

//   return (
//     <>
//       <DentistNavbar />
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-100 py-10 px-4">
//         <div className="max-w-7xl mx-auto">
//           <h1 className="text-4xl font-extrabold text-teal-700 text-center mb-10">
//             Welcome, {dentistName || "Dentist"}!
//           </h1>

//           <div className="grid gap-10">
//             {/* Upcoming Appointments */}
//             <div className="bg-white shadow-2xl rounded-2xl p-8 mx-4 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-shadow duration-300">
//               <h2 className="text-3xl font-extrabold text-teal-700 mb-6 flex items-center">
//                 <FaCalendarAlt className="text-teal-400 mr-3" />
//                 Upcoming Appointments
//               </h2>
//               {upcomingAppointments.length > 0 ? (
//                 renderAppointments(upcomingAppointments)
//               ) : (
//                 <p className="text-gray-500 text-sm">
//                   No upcoming appointments.
//                 </p>
//               )}
//             </div>

//             {/* Past Appointments */}
//             <div className="bg-white shadow-2xl rounded-2xl p-8 mx-4 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-shadow duration-300">
//               <h2 className="text-3xl font-extrabold text-teal-700 mb-6 flex items-center">
//                 <FaClipboard className="text-teal-400 mr-3" />
//                 Past Appointments
//               </h2>
//               {pastAppointments.length > 0 ? (
//                 renderAppointments(pastAppointments)
//               ) : (
//                 <p className="text-gray-500 text-sm">No past appointments.</p>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//       <Footer/>
//     </>
//   );
// };

// export default Dentist;

import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import DentistNavbar from "./DentistNavbar";
import {
  FaCalendarAlt,
  FaClock,
  FaUser,
  FaClipboard,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import Footer from "../Footer";

const ITEMS_PER_PAGE = 6;

const Dentist = () => {
  const { dentistId } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dentistName, setDentistName] = useState("");

  const [upcomingPage, setUpcomingPage] = useState(1);
  const [pastPage, setPastPage] = useState(1);

  useEffect(() => {
    const fetchDentistProfile = async () => {
      if (!dentistId) {
        toast.error("Dentist ID is not available.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}profiles/dentist`,
          { params: { dentistId } }
        );
        if (response.data && response.data.dentist) {
          setDentistName(response.data.dentist.name);
        }
      } catch {
        toast.error("Failed to fetch dentist profile.");
      }
    };

    fetchDentistProfile();
  }, [dentistId]);

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!dentistId) {
        toast.error("Dentist ID is not available.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_API_BASE_URL
          }appointments/getAllAppointmentsByDentistID?dentistId=${dentistId}`
        );
        setAppointments(response.data.appointments || []);
      } catch {
        toast.error("Failed to fetch appointments.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [dentistId]);

  const getISTDate = (dateString) => {
    const date = new Date(dateString);
    return new Date(date.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
  };

  const pastAppointments = appointments.filter((apt) => {
    const aptDateTimeStr = new Date(
      `${apt.apt_date.split("T")[0]}T${apt.apt_time}:00`
    );
    const aptDateTimeIST = getISTDate(aptDateTimeStr);
    const currentDateTimeIST = getISTDate(new Date());
    return aptDateTimeIST < currentDateTimeIST;
  });

  const upcomingAppointments = appointments.filter((apt) => {
    const aptDateTimeStr = new Date(
      `${apt.apt_date.split("T")[0]}T${apt.apt_time}:00`
    );
    const aptDateTimeIST = getISTDate(aptDateTimeStr);
    const currentDateTimeIST = getISTDate(new Date());
    return aptDateTimeIST >= currentDateTimeIST;
  });

  const paginate = (data, page) =>
    data.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const paginatedUpcoming = paginate(upcomingAppointments, upcomingPage);
  const paginatedPast = paginate(pastAppointments, pastPage);

  const totalUpcomingPages = Math.ceil(upcomingAppointments.length / ITEMS_PER_PAGE);
  const totalPastPages = Math.ceil(pastAppointments.length / ITEMS_PER_PAGE);

  const renderAppointments = (appointments) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
      {appointments.map((apt) => (
        <div
          key={apt._id}
          className="bg-white shadow-md rounded-lg p-6 hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-2"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
            <FaClipboard className="text-gray-500 mr-2" />
            Appointment ID: {apt.aptID}
          </h3>
          <p className="text-gray-600 flex items-center">
            <FaCalendarAlt className="text-blue-500 mr-2" />
            <strong>Date: </strong>{" "}
            {new Date(apt.apt_date).toLocaleDateString()}
          </p>
          <p className="text-gray-600 flex items-center">
            <FaClock className="text-green-500 mr-2" />
            <strong>Time: </strong> {apt.apt_time}
          </p>
          <p className="text-gray-600 flex items-center">
            <FaUser className="text-yellow-500 mr-2" />
            <strong>Patient Name: </strong> {apt.patientName}
          </p>
          <p className="text-gray-600 flex items-center">
            <FaClipboard className="text-gray-500 mr-2" />
            <strong>Reason: </strong> {apt.reason}
          </p>
          <p className="text-gray-600 flex items-center">
            {apt.status === "booked" ? (
              <>
                <FaCheckCircle className="text-green-500 mr-2" />
                <strong>Status: </strong> {apt.status}
              </>
            ) : (
              <>
                <FaTimesCircle className="text-red-500 mr-2" />
                <strong>Status: </strong> {apt.status}
              </>
            )}
          </p>
        </div>
      ))}
    </div>
  );

const renderPagination = (currentPage, totalPages, setPage) => (
  <div className="flex flex-wrap justify-center items-center mt-6 gap-4 text-sm sm:text-base">
    <button
      onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
      disabled={currentPage === 1}
      className="w-28 sm:w-32 px-4 py-2 rounded-md bg-teal-500 text-white font-medium hover:bg-teal-600 disabled:bg-gray-300 disabled:text-gray-600 disabled:cursor-not-allowed transition-all duration-200"
    >
      Previous
    </button>

    <span className="text-teal-800 font-medium text-center">
      Page {currentPage} of {totalPages}
    </span>

    <button
      onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
      disabled={currentPage === totalPages}
      className="w-28 sm:w-32 px-4 py-2 rounded-md bg-teal-500 text-white font-medium hover:bg-teal-600 disabled:bg-gray-300 disabled:text-gray-600 disabled:cursor-not-allowed transition-all duration-200"
    >
      Next
    </button>
  </div>
);

  if (loading) {
    return (
      <>
        <DentistNavbar />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-teal-100">
          <Loader2 className="h-6 w-6 animate-spin text-teal-600" />
        </div>
      </>
    );
  }

  return (
    <>
      <DentistNavbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-100 py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-extrabold text-teal-700 text-center mb-10">
            Welcome, {dentistName || "Dentist"}!
          </h1>

          <div className="grid gap-10">
            {/* Upcoming Appointments */}
            <div className="bg-white shadow-2xl rounded-2xl p-8 mx-4 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-shadow duration-300">
              <h2 className="text-3xl font-extrabold text-teal-700 mb-6 flex items-center">
                <FaCalendarAlt className="text-teal-400 mr-3" />
                Upcoming Appointments
              </h2>
              {upcomingAppointments.length > 0 ? (
                <>
                  {renderAppointments(paginatedUpcoming)}
                  {renderPagination(upcomingPage, totalUpcomingPages, setUpcomingPage)}
                </>
              ) : (
                <p className="text-gray-500 text-sm">
                  No upcoming appointments.
                </p>
              )}
            </div>

            {/* Past Appointments */}
            <div className="bg-white shadow-2xl rounded-2xl p-8 mx-4 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-shadow duration-300">
              <h2 className="text-3xl font-extrabold text-teal-700 mb-6 flex items-center">
                <FaClipboard className="text-teal-400 mr-3" />
                Past Appointments
              </h2>
              {pastAppointments.length > 0 ? (
                <>
                  {renderAppointments(paginatedPast)}
                  {renderPagination(pastPage, totalPastPages, setPastPage)}
                </>
              ) : (
                <p className="text-gray-500 text-sm">No past appointments.</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Dentist;