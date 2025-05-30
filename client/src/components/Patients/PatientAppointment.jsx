import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { ToastContainer, toast } from "react-toastify";
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
        const [patientRes, dentistRes] = await Promise.all([
          axios.get(`http://localhost:3000/api/patient/${patientId}`),
          axios.get("http://localhost:3000/api/profiles/getAllDentists"),
        ]);
        setPatient(patientRes.data.patient);
        setDentists(dentistRes.data.dentists || []);
      } catch (err) {
        toast.error("Error fetching profile or dentist list.");
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
      const url = `http://localhost:3000/api/appointments/${selectedDentistId}/available-slots/${selectedDate}`;
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
      .post("http://localhost:3000/api/appointments/create", appointmentData)
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
    <div className="min-h-screen bg-gray-50 flex justify-center items-start p-6">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-8 border border-teal-300 mt-6">
        <h2 className="text-3xl font-bold text-teal-600 mb-6 text-center">
          Book Appointment
        </h2>

        {patient && (
          <div className="mb-6">
            <p>
              <strong>Patient Name:</strong> {patient.name}
            </p>
            <p>
              <strong>Age:</strong> {patient.age}
            </p>
          </div>
        )}

        <div className="mb-4">
          <label className="text-lg text-teal-700">Select Dentist:</label>
          <select
            className="w-full mt-2 p-3 border border-teal-300 rounded"
            value={selectedDentistId}
            onChange={(e) => {
              setSelectedDentistId(e.target.value);
              setSelectedDate("");
              setSelectedTimeSlot("");
              setAvailableTimeSlots([]);
            }}
          >
            <option value="">Select a Dentist</option>
            {dentists.map((dentist) => (
              <option key={dentist.dentistId} value={dentist.dentistId}>
                {dentist.name} ({dentist.dentistId})
              </option>
            ))}
          </select>
        </div>

        {selectedDentistId && (
          <div className="mb-4">
            <label className="text-lg text-teal-700">Select Date:</label>
            <input
              type="date"
              className="w-full mt-2 p-3 border border-teal-300 rounded"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setSelectedTimeSlot("");
              }}
            />
          </div>
        )}

        {selectedDate && slotsLoading && (
          <div className="text-center text-gray-600">
            Loading available slots...
          </div>
        )}

        {selectedDate && !slotsLoading && (
          <>
            {availableTimeSlots.length > 0 ? (
              <div className="mb-4">
                <label className="text-lg text-teal-700">
                  Select Time Slot:
                </label>
                <select
                  className="w-full mt-2 p-3 border border-teal-300 rounded"
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
              <div className="text-red-500">
                Sorry Doctor is not available on {selectedDate}
              </div>
            )}
          </>
        )}

        {selectedDate && (
          <div className="mb-4">
            <label className="text-lg text-teal-700">
              Reason for Appointment:
            </label>
            <textarea
              className="w-full mt-2 p-3 border border-teal-300 rounded"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter reason..."
            />
          </div>
        )}

        <button
          className="w-full bg-teal-600 text-white py-3 rounded hover:bg-teal-700"
          onClick={handleAppointment}
          disabled={!selectedTimeSlot || !reason}
        >
          Book your Appointment
        </button>
      </div>
    </div>
  );
};

export default PatientAppointment;
