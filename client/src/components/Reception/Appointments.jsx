import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import Swal from 'sweetalert2';
import 'react-toastify/dist/ReactToastify.css'; // Import Toast styles
import 'sweetalert2/dist/sweetalert2.min.css'; // Import SweetAlert2 styles

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

  // Fetch patients on initial load
  useEffect(() => {
    axios
      .get('http://localhost:3000/api/patient/list')
      .then((response) => {
        setPatients(response.data.patients);
        setLoading(false); // Stop loading once data is fetched
      })
      .catch((error) => {
        console.error('Error fetching patients:', error);
        setError('Failed to load patients.');
        setLoading(false);
      });
  }, []);

  // Fetch dentist available slots when a patient is selected
  useEffect(() => {
    if (selectedPatient && selectedDate) {
      setScheduleLoading(true); // Start loading when date is selected
      axios
        .get(`http://localhost:3000/api/appointments/${selectedPatient.dentistId}/available-slots/${selectedDate}`)
        .then((response) => {
          setAvailableTimeSlots(response.data.availableSlots || []);
        })
        .catch((error) => {
          console.error('Error fetching available slots:', error);
          setError('Failed to load available time slots.');
          setAvailableTimeSlots([]);
        })
        .finally(() => {
          setScheduleLoading(false); // Stop loading once the data is fetched
        });
    }
  }, [selectedPatient, selectedDate]);

  // Handle patient selection
  const handlePatientChange = (event) => {
    const patientId = event.target.value;
    const selected = patients.find((patient) => patient.pID === patientId);
    setSelectedPatient(selected);
    setSelectedDate('');
    setSelectedTimeSlot('');
    setReason(''); // Reset reason when patient changes
    setAvailableTimeSlots([]); // Reset available slots when patient changes
  };

  // Handle date selection
  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
    setSelectedTimeSlot(''); // Reset time slot when a new date is selected
  };

  // Handle time slot selection
  const handleTimeSlotChange = (event) => {
    setSelectedTimeSlot(event.target.value);
  };

  // Handle reason input change
  const handleReasonChange = (event) => {
    setReason(event.target.value);
  };

  // Create appointment logic
  const handleCreateAppointment = () => {
    if (selectedPatient && selectedDate && selectedTimeSlot && reason) {
      axios
        .post('http://localhost:3000/api/appointments/create', {
          pID: selectedPatient.pID,
          date: selectedDate,
          slot: selectedTimeSlot,
          reason: reason,
        })
        .then(() => {
          toast.success('Appointment created successfully!', {
            position: "top-right",
            autoClose: 3000,
          });
          // Reset selections
          setSelectedDate('');
          setSelectedTimeSlot('');
          setReason('');
        })
        .catch((error) => {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Error creating appointment. Please try again.',
          });
        });
    } else {
      toast.error('Please select a patient, date, time slot, and provide a reason.', {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  if (loading) {
    return <div className="text-center text-xl font-semibold">Loading patients...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-100 rounded-xl shadow-lg">
      <ToastContainer />
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Appointment Management</h1>

      {/* Patient Selection */}
      <div className="mb-6">
        <label htmlFor="patientSelect" className="block text-lg font-medium text-gray-700 mb-2">Select Patient:</label>
        <select
          id="patientSelect"
          className="w-full p-3 border border-gray-300 rounded-lg bg-white"
          onChange={handlePatientChange}
        >
          <option value="">Select a Patient</option>
          {patients.map((patient) => (
            <option key={patient.pID} value={patient.pID}>
              {patient.name}
            </option>
          ))}
        </select>
      </div>

      {/* Display selected patient info */}
      {selectedPatient && (
        <div className="text-lg text-gray-800 mb-6">
          <p><strong>Patient Name:</strong> {selectedPatient.name}</p>
          <p><strong>Age:</strong> {selectedPatient.age}</p>
        </div>
      )}

      {/* Dentist Schedules (Date Selection) */}
      {selectedPatient && (
        <div className="space-y-6">
          {/* Date Selection */}
          <div className="mb-4">
            <label htmlFor="dateSelect" className="block text-lg font-medium text-gray-700 mb-2">Select Date:</label>
            <input
              type="date"
              id="dateSelect"
              className="w-full p-3 border border-gray-300 rounded-lg bg-white"
              onChange={handleDateChange}
              value={selectedDate}
            />
          </div>

          {/* Available Time Slot Selection */}
          {selectedDate && availableTimeSlots.length > 0 && (
            <div className="mb-4">
              <label htmlFor="timeSlotSelect" className="block text-lg font-medium text-gray-700 mb-2">Select Time Slot:</label>
              <select
                id="timeSlotSelect"
                className="w-full p-3 border border-gray-300 rounded-lg bg-white"
                onChange={handleTimeSlotChange}
                value={selectedTimeSlot}
              >
                <option value="">Select a Time Slot</option>
                {availableTimeSlots.map((timeSlot, index) => (
                  <option key={index} value={timeSlot}>
                    {timeSlot}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Reason for Appointment */}
          <div className="mb-4">
            <label htmlFor="reasonInput" className="block text-lg font-medium text-gray-700 mb-2">Reason for Appointment:</label>
            <textarea
              id="reasonInput"
              className="w-full p-3 border border-gray-300 rounded-lg bg-white"
              value={reason}
              onChange={handleReasonChange}
              placeholder="Enter reason for appointment"
            />
          </div>
        </div>
      )}

      {/* Loading indicator for schedules */}
      {scheduleLoading && <div className="text-center text-lg font-semibold text-gray-500">Loading available slots...</div>}

      {/* Error handling */}
      {error && <div className="text-red-500 text-center text-lg">{error}</div>}

      {/* Create Appointment Button */}
      <div className="mt-6">
        <button
          onClick={handleCreateAppointment}
          className="w-full py-3 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 disabled:bg-gray-300 disabled:cursor-not-allowed"
          disabled={!selectedPatient || !selectedDate || !selectedTimeSlot || !reason}
        >
          Create Appointment
        </button>
      </div>
    </div>
  );
};

export default Appointments;