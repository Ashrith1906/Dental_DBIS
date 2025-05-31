import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import "react-toastify/dist/ReactToastify.css";
import "sweetalert2/dist/sweetalert2.min.css";

const Appointments = () => {
  const [patients, setPatients] = useState([]);
  const [dentists, setDentists] = useState([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedDentistId, setSelectedDentistId] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(true);
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch all patients and dentists on load
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [patientsRes, dentistsRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_BASE_URL}patient`),
          axios.get(
            `${import.meta.env.VITE_API_BASE_URL}profiles/getAllDentists`
          ),
        ]);
        setPatients(patientsRes.data.patients || []);
        setDentists(dentistsRes.data.dentists || []);
      } catch (err) {
        toast.error("Failed to load data. Please try again.");
        setError("Failed to load patients or dentists.");
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  // Fetch available slots when dentist and date are selected
  useEffect(() => {
    if (selectedDentistId && selectedDate) {
      setScheduleLoading(true);
      const url = `${
        import.meta.env.VITE_API_BASE_URL
      }appointments/${selectedDentistId}/available-slots/${selectedDate}`;
      console.log("Sending request to:", url);
      axios
        .get(url)
        .then((response) => {
          console.log("Received response:", response.data);
          setAvailableTimeSlots(response.data.availableSlots || []);
          setError("");
        })
        .catch((err) => {
          console.error("Error fetching slots:", err);
          setAvailableTimeSlots([]);
          setError("Error fetching available slots. Please try again.");
        })
        .finally(() => setScheduleLoading(false));
    }
  }, [selectedDentistId, selectedDate]);

  const handleCreateAppointment = () => {
    if (
      !selectedPatient ||
      !selectedDentistId ||
      !selectedDate ||
      !selectedTimeSlot ||
      !reason
    ) {
      toast.error("All fields are required.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    axios
      .post(`${import.meta.env.VITE_API_BASE_URL}appointments/create`, {
        pID: selectedPatient.pID,
        dentistId: selectedDentistId,
        date: selectedDate,
        slot: selectedTimeSlot,
        reason,
      })
      .then(() => {
        toast.success("Appointment created successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
        setSelectedDate("");
        setSelectedTimeSlot("");
        setReason("");
        setAvailableTimeSlots([]);
      })
      .catch((error) => {
        const errorMessage =
          error.response?.data?.message ||
          "Error creating appointment. Please try again.";
        Swal.fire({ icon: "error", title: "Oops...", text: errorMessage });
      });
  };

  if (loading) {
    return (
      <div className="text-center text-xl font-semibold text-teal-500">
        Loading data...
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex justify-center items-center px-5"
      style={{
        background: "linear-gradient(135deg, #E0F2F1 0%, #CCFBF1 100%)",
      }}
    >
      <div className="w-full max-w-4xl p-8 bg-white rounded-2xl shadow-2xl border border-teal-300 mt-5">
        <h1 className="text-3xl font-extrabold text-teal-700 text-center mb-6">
          Appointment Management
        </h1>

        {/* Select Patient */}
        <div className="mb-6">
          <label
            htmlFor="patientSelect"
            className="block text-sm font-semibold text-teal-900 mb-1"
          >
            Select Patient:
          </label>
          <select
            id="patientSelect"
            className="w-full p-3 rounded-xl border border-teal-300 bg-gray-50 placeholder-gray-400
    focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400
    text-teal-700"
            onChange={(e) => {
              const patient = patients.find((p) => p.pID === e.target.value);
              setSelectedPatient(patient);
              setSelectedDentistId("");
              setSelectedDate("");
              setSelectedTimeSlot("");
              setReason("");
              setAvailableTimeSlots([]);
              setError("");
            }}
            defaultValue=""
          >
            <option value="" disabled>
              Select a Patient
            </option>
            {patients.map((patient) => (
              <option key={patient.pID} value={patient.pID}>
                {patient.name} — {patient.pID}
              </option>
            ))}
          </select>
        </div>

        {/* Show Patient Info and Dentist Dropdown */}
        {selectedPatient && (
          <>
            <div className="text-gray-600 mb-6 space-y-1 text-sm">
              <p>
                <strong className="text-teal-900">Patient Name:</strong>{" "}
                {selectedPatient.name}
              </p>
              <p>
                <strong className="text-teal-900">Age:</strong>{" "}
                {selectedPatient.age}
              </p>
            </div>

            <div className="mb-6">
              <label
                htmlFor="dentistSelect"
                className="block text-sm font-semibold text-teal-900 mb-1"
              >
                Select Dentist:
              </label>
              <select
                id="dentistSelect"
                className="w-full p-3 rounded-xl border border-teal-300 bg-gray-50 placeholder-gray-400
                focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400
                text-teal-700"
                value={selectedDentistId}
                onChange={(e) => {
                  setSelectedDentistId(e.target.value);
                  setSelectedDate("");
                  setSelectedTimeSlot("");
                  setAvailableTimeSlots([]);
                  setError("");
                }}
              >
                <option value="" disabled>
                  Select a Dentist
                </option>
                {dentists.map((dentist) => (
                  <option key={dentist._id} value={dentist.dentistId}>
                    {dentist.name} ({dentist.dentistId})
                  </option>
                ))}
              </select>
            </div>
          </>
        )}

        {/* Show Date Picker */}
        {selectedPatient && selectedDentistId && (
          <div className="mb-4">
            <label
              htmlFor="dateSelect"
              className="block text-sm font-semibold text-teal-900 mb-1"
            >
              Select Date:
            </label>
            <input
              type="date"
              id="dateSelect"
              className="w-full p-3 rounded-xl border border-teal-300 bg-gray-50 placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400
              text-teal-700"
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setSelectedTimeSlot("");
                setError("");
              }}
              value={selectedDate}
            />
          </div>
        )}

        {/* Show Time Slots */}
        {selectedDate && scheduleLoading && (
          <div className="text-center text-sm font-semibold text-gray-500 mb-4">
            Loading available slots...
          </div>
        )}

        {selectedDate && !scheduleLoading && availableTimeSlots.length > 0 && (
          <div className="mb-4">
            <label
              htmlFor="timeSlotSelect"
              className="block text-sm font-semibold text-teal-900 mb-1"
            >
              Select Time Slot:
            </label>
            <select
              id="timeSlotSelect"
              className="w-full p-3 rounded-xl border border-teal-300 bg-gray-50 placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400
              text-teal-700"
              onChange={(e) => setSelectedTimeSlot(e.target.value)}
              value={selectedTimeSlot}
            >
              <option value="" disabled>
                Select a Time Slot
              </option>
              {availableTimeSlots.map((slot, index) => (
                <option key={index} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </div>
        )}

        {selectedDate &&
          !scheduleLoading &&
          availableTimeSlots.length === 0 && (
            <div className="text-red-500 text-center text-sm mb-4">
              No slots available for the selected date.
            </div>
          )}

        {/* Reason for Appointment */}
        {selectedDate && (
          <div className="mb-4">
            <label
              htmlFor="reasonInput"
              className="block text-sm font-semibold text-teal-900 mb-1"
            >
              Reason for Appointment:
            </label>
            <textarea
              id="reasonInput"
              className="w-full p-3 rounded-xl border border-teal-300 bg-gray-50 placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400
              text-teal-700 resize-none"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter reason for appointment"
              rows={4}
            />
          </div>
        )}

        {error && (
          <div className="text-red-500 text-center text-sm font-semibold mb-4">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <div className="mt-6">
          <button
            onClick={handleCreateAppointment}
            className="w-full py-3 bg-teal-500 hover:bg-teal-600 rounded-xl text-white font-semibold
            shadow-md focus:outline-none focus:ring-2 focus:ring-teal-400 disabled:bg-gray-300 disabled:cursor-not-allowed"
            disabled={
              scheduleLoading ||
              !selectedPatient ||
              !selectedDentistId ||
              !selectedDate ||
              !selectedTimeSlot ||
              !reason
            }
          >
            Create Appointment
          </button>
        </div>
      </div>
    </div>
  );
};

export default Appointments;
