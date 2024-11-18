import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import Swal from 'sweetalert2';
import 'react-toastify/dist/ReactToastify.css';
import 'sweetalert2/dist/sweetalert2.min.css';

const Appointments = () => {
  const [patients, setPatients] = useState([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(true);
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    axios
      .get('http://localhost:3000/api/patient/list')
      .then((response) => {
        setPatients(response.data.patients || []);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load patients. Please try again later.');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (selectedPatient && selectedDate) {
      setScheduleLoading(true);
      axios
        .get(`http://localhost:3000/api/appointments/${selectedPatient.dentistId}/available-slots/${selectedDate}`)
        .then((response) => {
          setAvailableTimeSlots(response.data.availableSlots || []);
        })
        .catch(() => {
          setError('Error fetching available slots. Please try again.');
          setAvailableTimeSlots([]);
        })
        .finally(() => setScheduleLoading(false));
    }
  }, [selectedPatient, selectedDate]);

  const handleCreateAppointment = () => {
    if (!selectedPatient || !selectedDate || !selectedTimeSlot || !reason) {
      toast.error('All fields are required.', { position: 'top-right', autoClose: 3000 });
      return;
    }

    axios
      .post('http://localhost:3000/api/appointments/create', {
        pID: selectedPatient.pID,
        date: selectedDate,
        slot: selectedTimeSlot,
        reason,
      })
      .then(() => {
        toast.success('Appointment created successfully!', { position: 'top-right', autoClose: 3000 });
        setSelectedDate('');
        setSelectedTimeSlot('');
        setReason('');
        setAvailableTimeSlots([]);
      })
      .catch((error) => {
        const errorMessage = error.response?.data?.message || 'Error creating appointment. Please try again.';
        Swal.fire({ icon: 'error', title: 'Oops...', text: errorMessage });
      });
  };

  if (loading) {
    return <div className="text-center text-xl font-semibold text-teal-500">Loading patients...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center px-5">
      <div className="w-full max-w-4xl p-8 bg-teal-50 rounded-xl shadow-lg border-2 border-teal-300 mt-5">
        <ToastContainer />
        <h1 className="text-3xl font-bold text-center text-teal-600 mb-6">Appointment Management</h1>

        <div className="mb-6">
          <label htmlFor="patientSelect" className="text-lg font-medium text-teal-700 mb-2">
            Select Patient:
          </label>
          <select
            id="patientSelect"
            className="w-full p-3 border border-teal-300 rounded-lg bg-white focus:ring-2 focus:ring-teal-500"
            onChange={(e) => {
              const patient = patients.find((p) => p.pID === e.target.value);
              setSelectedPatient(patient);
              setSelectedDate('');
              setSelectedTimeSlot('');
              setReason('');
              setAvailableTimeSlots([]);
              setError('');
            }}
          >
            <option value="">Select a Patient</option>
            {patients.map((patient) => (
              <option key={patient.pID} value={patient.pID}>
                {patient.name}
              </option>
            ))}
          </select>
        </div>

        {selectedPatient && (
          <div className="text-lg text-gray-800 mb-6">
            <p><strong>Patient Name:</strong> {selectedPatient.name}</p>
            <p><strong>Age:</strong> {selectedPatient.age}</p>
          </div>
        )}

        {selectedPatient && (
          <div className="space-y-6">
            <div className="mb-4">
              <label htmlFor="dateSelect" className="text-lg font-medium text-teal-700 mb-2">
                Select Date:
              </label>
              <input
                type="date"
                id="dateSelect"
                className="w-full p-3 border border-teal-300 rounded-lg bg-white focus:ring-2 focus:ring-teal-500"
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setSelectedTimeSlot('');
                  setError('');
                }}
                value={selectedDate}
              />
            </div>

            {scheduleLoading ? (
              <div className="text-center text-lg font-semibold text-gray-500">Loading available slots...</div>
            ) : (
              selectedDate &&
              availableTimeSlots.length > 0 && (
                <div className="mb-4">
                  <label htmlFor="timeSlotSelect" className="text-lg font-medium text-teal-700 mb-2">
                    Select Time Slot:
                  </label>
                  <select
                    id="timeSlotSelect"
                    className="w-full p-3 border border-teal-300 rounded-lg bg-white focus:ring-2 focus:ring-teal-500"
                    onChange={(e) => setSelectedTimeSlot(e.target.value)}
                    value={selectedTimeSlot}
                  >
                    <option value="">Select a Time Slot</option>
                    {availableTimeSlots.map((slot, index) => (
                      <option key={index} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              )
            )}

            {selectedDate && availableTimeSlots.length === 0 && (
              <div className="text-red-500 text-center text-lg">No slots available for the selected date.</div>
            )}

            <div className="mb-4">
              <label htmlFor="reasonInput" className="text-lg font-medium text-teal-700 mb-2">
                Reason for Appointment:
              </label>
              <textarea
                id="reasonInput"
                className="w-full p-3 border border-teal-300 rounded-lg bg-white focus:ring-2 focus:ring-teal-500"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter reason for appointment"
              />
            </div>
          </div>
        )}

        {error && <div className="text-red-500 text-center text-lg">{error}</div>}

        <div className="mt-6">
          <button
            onClick={handleCreateAppointment}
            className="w-full py-3 px-4 bg-teal-500 text-white rounded-lg hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-400 disabled:bg-gray-300 disabled:cursor-not-allowed"
            disabled={scheduleLoading || !selectedPatient || !selectedDate || !selectedTimeSlot || !reason}
          >
            Create Appointment
          </button>
        </div>
      </div>
    </div>
  );
};

export default Appointments;