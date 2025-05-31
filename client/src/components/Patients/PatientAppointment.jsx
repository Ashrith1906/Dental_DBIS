import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import "react-toastify/dist/ReactToastify.css";

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
  const [error, setError] = useState("");

  // Fetch patient and dentists
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dentistRes, patientRes] = await Promise.allSettled([
          axios.get(
            `${import.meta.env.VITE_API_BASE_URL}profiles/getAllDentists`
          ),
          axios.get(`${import.meta.env.VITE_API_BASE_URL}patient/${patientId}`),
        ]);

        // Handle dentists
        if (dentistRes.status === "fulfilled") {
          setDentists(dentistRes.value.data.dentists || []);
        } else {
          toast.error("Failed to fetch dentists list.");
        }

        // Handle patient
        if (patientRes.status === "fulfilled") {
          setPatient(patientRes.value.data.patient);
        } else if (
          patientRes.reason.response &&
          patientRes.reason.response.status === 404
        ) {
          toast.info(
            "Please complete your profile before booking an appointment."
          );
          setPatient(null); // optional, just to be safe
        } else {
          toast.error("Error fetching your profile.");
        }
      } catch (err) {
        toast.error("Unexpected error loading data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [patientId]);

  // Fetch available slots
  useEffect(() => {
    if (selectedDentistId && selectedDate) {
      setSlotsLoading(true);
      const url = `${
        import.meta.env.VITE_API_BASE_URL
      }appointments/${selectedDentistId}/available-slots/${selectedDate}`;
      console.log("Sending request to:", url);
      axios
        .get(url)
        .then((res) => {
          console.log("Received response:", res.data);
          setAvailableTimeSlots(res.data.availableSlots || []);
        })
        .catch((err) => {
          console.error("Error fetching slots:", err);
          setAvailableTimeSlots([]);
          setError("Could not load slots.");
        })
        .finally(() => setSlotsLoading(false));
    }
  }, [selectedDentistId, selectedDate]);

  const handleAppointment = () => {
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

    console.log("Creating appointment with:", appointmentData);

    axios
      .post(
        `${import.meta.env.VITE_API_BASE_URL}appointments/create`,
        appointmentData
      )
      .then(() => {
        toast.success("Appointment booked successfully!");
        setSelectedDate("");
        setSelectedTimeSlot("");
        setReason("");
        setAvailableTimeSlots([]);
      })
      .catch((err) => {
        const errorMessage =
          err.response?.data?.message || "Failed to create appointment.";
        Swal.fire({ icon: "error", title: "Error", text: errorMessage });
      });
  };

  if (loading) {
    return (
      <div className="text-center text-lg text-teal-600 font-medium">
        Loading profile...
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
            <p>
              <span className="font-semibold text-teal-900">Patient Name:</span>{" "}
              {patient.name}
            </p>
            <p>
              <span className="font-semibold text-teal-900">Age:</span>{" "}
              {patient.age}
            </p>
          </div>
        )}

        <div className="space-y-5">
          {/* Dentist Select */}
          <div>
            <label className="block text-sm font-medium text-teal-900 mb-1">
              Select Dentist
            </label>
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
              <label className="block text-sm font-medium text-teal-900 mb-1">
                Select Date
              </label>
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
            <div className="text-sm text-gray-600">
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
                      <option key={idx} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="text-red-500 text-sm font-medium">
                  Sorry, the dentist is not available on {selectedDate}.
                </div>
              )}
            </>
          )}

          {/* Reason Textarea */}
          {selectedDate && (
            <div>
              <label className="block text-sm font-medium text-teal-900 mb-1">
                Reason for Appointment
              </label>
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
            className="w-full bg-teal-500 hover:bg-teal-600 text-white text-base font-semibold py-3 rounded-xl shadow-md transition duration-200 disabled:opacity-50"
            onClick={handleAppointment}
            disabled={!selectedTimeSlot || !reason}
          >
            Book your Appointment
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientAppointment;
