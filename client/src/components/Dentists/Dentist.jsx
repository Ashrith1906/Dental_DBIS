import React, { useEffect, useState } from "react";
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

const Dentist = () => {
  const { dentistId } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dentistName, setDentistName] = useState(''); // Store the dentist's name

  // Fetch dentist profile on component mount
  useEffect(() => {
    const fetchDentistProfile = async () => {
      if (!dentistId) {
        setError("Dentist ID is not available.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`http://localhost:3000/api/profiles/dentist`, {
          params: { dentistId },
        });
        if (response.data && response.data.dentist) {
          setDentistName(response.data.dentist.name); // Set the dentist's name
        }
      } catch (err) {
        setError("Failed to fetch dentist profile.");
        setLoading(false);
      }
    };

    fetchDentistProfile();
  }, [dentistId]);

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!dentistId) {
        setError("Dentist ID is not available.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:3000/api/appointments/getAllAppointmentsByDentistID?dentistId=${dentistId}`
        );
        setAppointments(response.data.appointment);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "An error occurred");
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [dentistId]);

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  const currentDate = new Date();

  // Classify appointments into past and upcoming
  const pastAppointments = appointments.filter(
    (apt) => new Date(apt.apt_date) < currentDate
  );
  const upcomingAppointments = appointments.filter(
    (apt) => new Date(apt.apt_date) >= currentDate
  );

  const renderAppointments = (appointments) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
      {appointments.map((apt) => (
        <div
          key={apt._id}
          className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow duration-300 transform hover:-translate-y-1"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
            <FaClipboard className="text-gray-500 mr-2" />
            Appointment ID: {apt.aptID}
          </h3>
          <p className="text-gray-600 flex items-center">
            <FaCalendarAlt className="text-blue-500 mr-2" />
            <strong>Date:</strong> {new Date(apt.apt_date).toLocaleDateString()}
          </p>
          <p className="text-gray-600 flex items-center">
            <FaClock className="text-green-500 mr-2" />
            <strong>Time:</strong> {apt.apt_time}
          </p>
          <p className="text-gray-600 flex items-center">
            <FaUser className="text-yellow-500 mr-2" />
            <strong>Patient ID:</strong> {apt.pID}
          </p>
          <p className="text-gray-600 flex items-center">
            <FaClipboard className="text-gray-500 mr-2" />
            <strong>Reason:</strong> {apt.reason}
          </p>
          <p className="text-gray-600 flex items-center">
            {apt.status === "booked" ? (
              <>
                <FaCheckCircle className="text-green-500 mr-2" />
                <strong>Status:</strong> {apt.status}
              </>
            ) : (
              <>
                <FaTimesCircle className="text-red-500 mr-2" />
                <strong>Status:</strong> {apt.status}
              </>
            )}
          </p>
        </div>
      ))}
    </div>
  );

  return (
    <>
      <DentistNavbar />
      <div className="container mx-auto px-4 py-8">
        {/* Welcome message */}
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">
          Welcome,  {dentistName || "Dentist"}!
        </h1>
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Your Upcoming Appointments
          </h2>
          {upcomingAppointments.length > 0 ? (
            renderAppointments(upcomingAppointments)
          ) : (
            <p className="text-gray-500">No upcoming appointments</p>
          )}
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Your Past Appointments
          </h2>
          {pastAppointments.length > 0 ? (
            renderAppointments(pastAppointments)
          ) : (
            <p className="text-gray-500">No past appointments</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Dentist;