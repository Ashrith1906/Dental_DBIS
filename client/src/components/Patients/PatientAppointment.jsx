// import { useEffect, useState, useRef } from "react";
// import axios from "axios";
// import { useAuth } from "../contexts/AuthContext";
// import toast from "react-hot-toast";
// import { Loader2 } from "lucide-react";

// const PatientAppointment = () => {
//   const { patientId } = useAuth();
//   const [patient, setPatient] = useState(null);
//   const [dentists, setDentists] = useState([]);
//   const [selectedDentistId, setSelectedDentistId] = useState("");
//   const [selectedDate, setSelectedDate] = useState("");
//   const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
//   const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
//   const [reason, setReason] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [slotsLoading, setSlotsLoading] = useState(false);
//   const [booking, setBooking] = useState(false);

//   const dentistToastId = useRef(null);
//   const profileToastId = useRef(null);
//   const slotsToastId = useRef(null);
//   const bookingToastId = useRef(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [dentistRes, patientRes] = await Promise.allSettled([
//           axios.get(
//             `${import.meta.env.VITE_API_BASE_URL}profiles/getAllDentists`
//           ),
//           axios.get(`${import.meta.env.VITE_API_BASE_URL}patient/${patientId}`),
//         ]);

//         if (dentistRes.status === "fulfilled") {
//           setDentists(dentistRes.value.data.dentists || []);
//         } else {
//           if (!dentistToastId.current) {
//             dentistToastId.current = toast.error(
//               "Failed to fetch dentists list."
//             );
//           }
//         }

//         if (patientRes.status === "fulfilled") {
//           setPatient(patientRes.value.data.patient);
//         } else if (
//           patientRes.reason.response &&
//           patientRes.reason.response.status === 404
//         ) {
//           if (!profileToastId.current) {
//             profileToastId.current = toast(
//               "Please complete your profile before booking.",
//               {
//                 icon: "⚠️",
//               }
//             );
//           }
//           setPatient(null);
//         } else {
//           if (!profileToastId.current) {
//             profileToastId.current = toast.error(
//               "Error fetching your profile."
//             );
//           }
//         }
//       } catch (err) {
//         toast.error("Unexpected error loading data.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [patientId]);

//   useEffect(() => {
//     if (selectedDentistId && selectedDate) {
//       setSlotsLoading(true);
//       const url = `${
//         import.meta.env.VITE_API_BASE_URL
//       }appointments/${selectedDentistId}/available-slots/${selectedDate}`;

//       axios
//         .get(url)
//         .then((res) => {
//           setAvailableTimeSlots(res.data.availableSlots || []);
//         })
//         .catch(() => {
//           if (!slotsToastId.current) {
//             slotsToastId.current = toast.error("Could not load slots.");
//           }
//           setAvailableTimeSlots([]);
//         })
//         .finally(() => setSlotsLoading(false));
//     }
//   }, [selectedDentistId, selectedDate]);

//   const handleAppointment = async () => {
//     if (!selectedDentistId || !selectedDate || !selectedTimeSlot || !reason) {
//       toast.error("Please complete all fields.");
//       return;
//     }

//     const appointmentData = {
//       pID: patientId,
//       dentistId: selectedDentistId,
//       date: selectedDate,
//       slot: selectedTimeSlot,
//       reason,
//     };

//     setBooking(true);
//     try {
//       await axios.post(
//         `${import.meta.env.VITE_API_BASE_URL}appointments/create`,
//         appointmentData
//       );
//       toast.success("Appointment booked successfully!");
//       setSelectedDate("");
//       setSelectedTimeSlot("");
//       setReason("");
//       setAvailableTimeSlots([]);
//     } catch (err) {
//       toast.error(
//         err.response?.data?.message || "Failed to create appointment."
//       );
//     } finally {
//       setBooking(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex justify-center items-center">
//         <div className="flex items-center gap-3 text-lg text-teal-600 font-medium">
//           <Loader2 className="h-6 w-6 animate-spin text-teal-600" />
//           Checking profile...
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-100 flex justify-center items-start p-6">
//       <div className="w-full max-w-3xl bg-white shadow-2xl rounded-2xl p-8 border border-gray-300 mt-10">
//         <h2 className="text-3xl font-extrabold text-teal-700 mb-6 text-center">
//           Book Appointment
//         </h2>

//         {patient && (
//           <div className="mb-6 text-gray-700 space-y-2">
//             <p>
//               <span className="font-semibold text-teal-900">Patient Name:</span>{" "}
//               {patient.name}
//             </p>
//             <p>
//               <span className="font-semibold text-teal-900">Age:</span>{" "}
//               {patient.age}
//             </p>
//           </div>
//         )}

//         <div className="space-y-5">
//           {/* Dentist Select */}
//           <div>
//             <label className="block text-sm font-medium text-teal-900 mb-1">
//               Select Dentist
//             </label>
//             <select
//               className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-teal-400"
//               value={selectedDentistId}
//               onChange={(e) => {
//                 setSelectedDentistId(e.target.value);
//                 setSelectedDate("");
//                 setSelectedTimeSlot("");
//                 setAvailableTimeSlots([]);
//               }}
//             >
//               <option value="">Choose a Dentist</option>
//               {dentists.map((dentist) => (
//                 <option key={dentist.dentistId} value={dentist.dentistId}>
//                   {dentist.name} ({dentist.dentistId})
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Date Picker */}
//           {selectedDentistId && (
//             <div>
//               <label className="block text-sm font-medium text-teal-900 mb-1">
//                 Select Date
//               </label>
//               <input
//                 type="date"
//                 className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-teal-400"
//                 value={selectedDate}
//                 onChange={(e) => {
//                   setSelectedDate(e.target.value);
//                   setSelectedTimeSlot("");
//                 }}
//               />
//             </div>
//           )}

//           {/* Time Slots */}
//           {selectedDate && slotsLoading && (
//             <div className="text-sm text-gray-600 flex items-center gap-2">
//               <Loader2 className="h-6 w-6 animate-spin text-teal-600" /> Loading
//               available slots...
//             </div>
//           )}

//           {selectedDate && !slotsLoading && (
//             <>
//               {availableTimeSlots.length > 0 ? (
//                 <div>
//                   <label className="block text-sm font-medium text-teal-900 mb-1">
//                     Select Time Slot
//                   </label>
//                   <select
//                     className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-teal-400"
//                     value={selectedTimeSlot}
//                     onChange={(e) => setSelectedTimeSlot(e.target.value)}
//                   >
//                     <option value="">Choose a time slot</option>
//                     {availableTimeSlots.map((slot, idx) => (
//                       <option key={idx} value={slot}>
//                         {slot}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               ) : (
//                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800 shadow-sm flex items-start gap-3">
//   <span className="text-2xl">😕</span>
//   <div>
//     <p className="font-semibold">
//       No slots available for <span className="text-teal-700">{selectedDate}</span>.
//     </p>
//     <p className="text-sm mt-1">
//       The dentist hasn't opened their schedule for this day. Please try another date or select a different dentist.
//     </p>
//   </div>
// </div>
//               )}
//             </>
//           )}

//           {/* Reason Textarea */}
//           {selectedDate && (
//             <div>
//               <label className="block text-sm font-medium text-teal-900 mb-1">
//                 Reason for Appointment
//               </label>
//               <textarea
//                 className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-teal-400"
//                 placeholder="Enter reason..."
//                 value={reason}
//                 onChange={(e) => setReason(e.target.value)}
//                 rows={3}
//               />
//             </div>
//           )}

//           {/* Submit Button */}
//           <button
//             className="w-full bg-teal-500 hover:bg-teal-600 text-white text-base font-semibold py-3 rounded-xl shadow-md transition duration-200 disabled:opacity-50 flex justify-center items-center gap-2"
//             onClick={handleAppointment}
//             disabled={booking || !selectedTimeSlot || !reason}
//           >
//             {booking ? (
//               <>
//                 <Loader2 className="h-6 w-6 animate-spin text-teal-600" />{" "}
//                 Booking...
//               </>
//             ) : (
//               "Book your Appointment"
//             )}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PatientAppointment;


import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

const PatientAppointment = () => {
  const { patientId } = useAuth();
  const [patient, setPatient] = useState(null);
  const [dentists, setDentists] = useState([]);
  const [selectedDentistId, setSelectedDentistId] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(true);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [booking, setBooking] = useState(false);

  // Toast refs to avoid duplicate alerts
  const dentistToastId = useRef(null);
  const profileToastId = useRef(null);
  const slotsToastId = useRef(null);
  const bookingToastId = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dentistRes, patientRes] = await Promise.allSettled([
          axios.get(`${import.meta.env.VITE_API_BASE_URL}profiles/getAllDentists`),
          axios.get(`${import.meta.env.VITE_API_BASE_URL}patient/${patientId}`),
        ]);

        if (dentistRes.status === "fulfilled") {
          setDentists(dentistRes.value.data.dentists || []);
        } else {
          if (!dentistToastId.current) {
            dentistToastId.current = toast.error("Failed to fetch dentists list.");
          }
        }

        if (patientRes.status === "fulfilled") {
          setPatient(patientRes.value.data.patient);
        } else if (
          patientRes.reason?.response?.status === 404
        ) {
          if (!profileToastId.current) {
            profileToastId.current = toast(
              "Please complete your profile before booking.",
              { icon: "⚠️" }
            );
          }
        } else {
          if (!profileToastId.current) {
            profileToastId.current = toast.error("Error fetching your profile.");
          }
        }
      } catch (err) {
        toast.error("Unexpected error loading data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [patientId]);

  useEffect(() => {
    if (selectedDentistId && selectedDate) {
      setSlotsLoading(true);
      const url = `${import.meta.env.VITE_API_BASE_URL}appointments/${selectedDentistId}/available-slots/${selectedDate}`;

      axios
        .get(url)
        .then((res) => {
          setAvailableTimeSlots(res.data.availableSlots || []);
        })
        .catch(() => {
          if (!slotsToastId.current) {
            slotsToastId.current = toast.error("Could not load slots.");
          }
          setAvailableTimeSlots([]);
        })
        .finally(() => setSlotsLoading(false));
    }
  }, [selectedDentistId, selectedDate]);

  const handleAppointment = async () => {
    if (!selectedDentistId || !selectedDate || !selectedTimeSlot || !reason) {
      toast.error("Please complete all fields.");
      return;
    }

    const appointmentData = {
      pID: patientId,
      dentistId: selectedDentistId,
      date: selectedDate,
      slot: selectedTimeSlot,
      reason,
    };

    setBooking(true);
    if (bookingToastId.current) toast.dismiss(bookingToastId.current);
    bookingToastId.current = toast.loading("Booking your appointment...");

    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}appointments/create`, appointmentData);
      toast.dismiss(bookingToastId.current);
      bookingToastId.current = null;
      toast.success("Appointment booked successfully!");
      setSelectedDate("");
      setSelectedTimeSlot("");
      setReason("");
      setAvailableTimeSlots([]);
    } catch (err) {
      toast.dismiss(bookingToastId.current);
      bookingToastId.current = null;
      toast.error(err.response?.data?.message || "Failed to create appointment.");
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="flex items-center gap-3 text-lg text-teal-600 font-medium">
          <Loader2 className="h-6 w-6 animate-spin text-teal-600" />
          Checking profile...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-100 flex justify-center items-start p-6">
      <div className="w-full max-w-3xl bg-white shadow-2xl rounded-2xl p-8 border border-gray-300 mt-10">
        <h2 className="text-3xl font-extrabold text-teal-700 mb-6 text-center">
          Book Appointment
        </h2>

        {patient && (
          <div className="mb-6 text-gray-700 space-y-2">
            <p><span className="font-semibold text-teal-900">Patient Name:</span> {patient.name}</p>
            <p><span className="font-semibold text-teal-900">Age:</span> {patient.age}</p>
          </div>
        )}

        <div className="space-y-5">
          {/* Dentist Select */}
          <div>
            <label className="block text-sm font-medium text-teal-900 mb-1">Select Dentist</label>
            <select
              className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-teal-400"
              value={selectedDentistId}
              onChange={(e) => {
                setSelectedDentistId(e.target.value);
                setSelectedDate("");
                setSelectedTimeSlot("");
                setAvailableTimeSlots([]);
              }}
            >
              <option value="">Choose a Dentist</option>
              {dentists.map((dentist) => (
                <option key={dentist.dentistId} value={dentist.dentistId}>
                  {dentist.name} ({dentist.dentistId})
                </option>
              ))}
            </select>
          </div>

          {/* Date Picker */}
          {selectedDentistId && (
            <div>
              <label className="block text-sm font-medium text-teal-900 mb-1">Select Date</label>
              <input
                type="date"
                className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-teal-400"
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setSelectedTimeSlot("");
                }}
              />
            </div>
          )}

          {/* Time Slots */}
          {selectedDate && slotsLoading && (
            <div className="text-sm text-gray-600 flex items-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin text-teal-600" />
              Loading available slots...
            </div>
          )}

          {selectedDate && !slotsLoading && (
            <>
              {availableTimeSlots.length > 0 ? (
                <div>
                  <label className="block text-sm font-medium text-teal-900 mb-1">
                    Select Time Slot
                  </label>
                  <select
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-teal-400"
                    value={selectedTimeSlot}
                    onChange={(e) => setSelectedTimeSlot(e.target.value)}
                  >
                    <option value="">Choose a time slot</option>
                    {availableTimeSlots.map((slot, idx) => (
                      <option key={idx} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800 shadow-sm flex items-start gap-3">
                  <span className="text-2xl">😕</span>
                  <div>
                    <p className="font-semibold">
                      No slots available for <span className="text-teal-700">{selectedDate}</span>.
                    </p>
                    <p className="text-sm mt-1">
                      The dentist hasn't opened their schedule for this day. Try another date or select a different dentist.
                    </p>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Reason Textarea */}
          {selectedDate && (
            <div>
              <label className="block text-sm font-medium text-teal-900 mb-1">Reason for Appointment</label>
              <textarea
                className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-teal-400"
                placeholder="Enter reason..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
              />
            </div>
          )}

          {/* Submit Button */}
          <button
            className="w-full bg-teal-500 hover:bg-teal-600 text-white text-base font-semibold py-3 rounded-xl shadow-md transition duration-200 disabled:opacity-50 flex justify-center items-center gap-2"
            onClick={handleAppointment}
            disabled={booking || !selectedTimeSlot || !reason}
          >
            {booking ? (
              <>
                <Loader2 className="h-6 w-6 animate-spin text-white" />
                Booking...
              </>
            ) : (
              "Book your Appointment"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientAppointment;