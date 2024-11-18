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
  const [dentistName, setDentistName] = useState(""); // Store the dentist's name

  useEffect(() => {
    const fetchDentistProfile = async () => {
      if (!dentistId) {
        setError("Dentist ID is not available.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:3000/api/profiles/dentist`,
          {
            params: { dentistId },
          }
        );
        if (response.data && response.data.dentist) {
          setDentistName(response.data.dentist.name); // Set the dentist's name
        }
      } catch (err) {
        setError("Failed to fetch dentist profile.");
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
        setAppointments(response.data.appointments || []); // Ensure an empty array if no data
      } catch (err) {
        // setError("Failed to fetch appointments.");
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
    // Construct the appointment date-time in IST
    const aptDateTimeStr = new Date(`${apt.apt_date.split("T")[0]}T${apt.apt_time}:00`);
    const aptDateTimeIST = getISTDate(aptDateTimeStr);
  
    // Current date-time in IST
    const currentDateTimeIST = getISTDate(new Date());
  
    console.log("Comparing Appointment Time (IST):", aptDateTimeIST);
    console.log("Current Time (IST):", currentDateTimeIST);
  
    // Compare the appointment's IST date/time with the current IST date/time
    return aptDateTimeIST < currentDateTimeIST;
  });
  
  const upcomingAppointments = appointments.filter((apt) => {
    // Construct the appointment date-time in IST
    const aptDateTimeStr = new Date(`${apt.apt_date.split("T")[0]}T${apt.apt_time}:00`);
    const aptDateTimeIST = getISTDate(aptDateTimeStr);
  
    // Current date-time in IST
    const currentDateTimeIST = getISTDate(new Date());
  
    console.log("Comparing Appointment Time (IST):", aptDateTimeIST);
    console.log("Current Time (IST):", currentDateTimeIST);
  
    // Compare the appointment's IST date/time with the current IST date/time
    return aptDateTimeIST >= currentDateTimeIST;
  });

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

  return (
    <>
      <DentistNavbar />
      <div className="container mx-auto px-4 py-8">
        {/* Welcome message */}
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">
          Welcome, {dentistName || "Dentist"}!
        </h1>

        {error && <p className="text-center text-red-500">Error: {error}</p>}

        <div className="grid gap-8">
          <div className=" shadow-md rounded-lg p-6  hover:shadow-xl transition-shadow duration-300 mx-5">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Your Upcoming Appointments
            </h2>
            {upcomingAppointments.length > 0 ? (
              renderAppointments(upcomingAppointments)
            ) : (
              <p className="text-gray-500">No upcoming appointments.</p>
            )}
          </div>

          <div className=" shadow-md rounded-lg p-6  hover:shadow-xl transition-shadow duration-300 mx-5">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Your Past Appointments
            </h2>
            {pastAppointments.length > 0 ? (
              renderAppointments(pastAppointments)
            ) : (
              <p className="text-gray-500">No past appointments.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dentist;
