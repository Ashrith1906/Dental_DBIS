import React, { useState, useEffect } from "react";
import axios from "axios";
import ReceptionNavbar from "./ReceptionNavbar";
import { 
  FaUser, 
  FaCalendarAlt, 
  FaClock, 
  FaUserMd, 
  FaVenusMars 
} from "react-icons/fa";

const PatientRecords = () => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "name", direction: "asc" });

  // Fetch all patients
  const fetchPatients = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/patient");
      setPatients(response.data.patients);
      setFilteredPatients(response.data.patients);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch patients");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  // Filter patients based on search term
  useEffect(() => {
    const result = patients.filter((patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.pID.toString().includes(searchTerm)
    );
    setFilteredPatients(result);
  }, [searchTerm, patients]);

  // Sorting function
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
    const sortedPatients = [...filteredPatients].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });
    setFilteredPatients(sortedPatients);
  };

  // Render loading or error states
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
      <ReceptionNavbar />
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6 text-center text-teal-600">Patient Records</h1>

        {/* Search Bar */}
        <div className="mb-4 flex justify-end">
          <input
            type="text"
            className="border p-2 rounded-md w-1/3 bg-gray-50 text-gray-700 focus:ring-2 focus:ring-blue-500"
            placeholder="Search by Name or Patient ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Table with Sorting Options */}
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-teal-100 text-gray-700">
                <th
                  className="border border-gray-300 px-4 py-2 cursor-pointer text-left hover:bg-blue-200"
                  onClick={() => handleSort("pID")}
                >
                  Patient ID
                </th>
                <th
                  className="border border-gray-300 px-4 py-2 cursor-pointer text-left hover:bg-blue-200"
                  onClick={() => handleSort("name")}
                >
                  Name
                </th>
                {/* <th
                  className="border border-gray-300 px-4 py-2 cursor-pointer text-left hover:bg-blue-200"
                  onClick={() => handleSort("name")}
                >
                  Current Consultant
                </th> */}
                <th
                  className="border border-gray-300 px-4 py-2 cursor-pointer text-left hover:bg-blue-200"
                  onClick={() => handleSort("age")}
                >
                  Age
                </th>
                <th
                  className="border border-gray-300 px-4 py-2 cursor-pointer text-left hover:bg-blue-200"
                  onClick={() => handleSort("gender")}
                >
                  Gender
                </th>
                <th
                  className="border border-gray-300 px-4 py-2 cursor-pointer text-left hover:bg-blue-200"
                  onClick={() => handleSort("phone_no")}
                >
                  Phone
                </th>
                <th
                  className="border border-gray-300 px-4 py-2 cursor-pointer text-left hover:bg-blue-200"
                  onClick={() => handleSort("address")}
                >
                  Address
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((patient, index) => (
                <tr
                  key={patient._id}
                  className={`${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } hover:bg-blue-50`}
                >
                  <td className="border border-gray-300 px-4 py-2">{patient.pID}</td>
                  <td className="border border-gray-300 px-4 py-2">{patient.name}</td>
                  {/* <td className="border border-gray-300 px-4 py-2">{patient.dentistName}</td> */}
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