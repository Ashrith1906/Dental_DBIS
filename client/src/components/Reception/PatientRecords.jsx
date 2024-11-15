import React, { useState, useEffect } from "react";
import axios from "axios";
import ReceptionNavbar from "./ReceptionNavbar";

const PatientRecords = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch all patients
  const fetchPatients = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/patient/list");
      setPatients(response.data.patients);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch patients");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl font-semibold text-blue-500">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl font-semibold text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <>
    <ReceptionNavbar/>
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Patient Records</h1>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="border border-gray-300 px-4 py-2">Patient ID</th>
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Age</th>
              <th className="border border-gray-300 px-4 py-2">Gender</th>
              <th className="border border-gray-300 px-4 py-2">Phone</th>
              <th className="border border-gray-300 px-4 py-2">Address</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient, index) => (
              <tr
                key={patient._id}
                className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
              >
                <td className="border border-gray-300 px-4 py-2">{patient.pID}</td>
                <td className="border border-gray-300 px-4 py-2">{patient.name}</td>
                <td className="border border-gray-300 px-4 py-2">{patient.age}</td>
                <td className="border border-gray-300 px-4 py-2">{patient.gender}</td>
                <td className="border border-gray-300 px-4 py-2">{patient.phone_no}</td>
                <td className="border border-gray-300 px-4 py-2">{patient.address}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </>
  );
};

export default PatientRecords;