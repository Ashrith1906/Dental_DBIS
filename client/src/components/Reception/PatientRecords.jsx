import { useState, useEffect } from "react";
import axios from "axios";
import ReceptionNavbar from "./ReceptionNavbar";

const PatientRecords = () => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });

  // Fetch all patients
  const fetchPatients = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}patient`
      );
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
    const result = patients.filter(
      (patient) =>
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-100 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-extrabold text-teal-700 text-center mb-6">
            Patient Records
          </h1>

          {/* Search Bar */}
          <div className="flex justify-end mb-6">
            <input
              type="text"
              className="w-full sm:w-1/3 p-3 bg-gray-50 text-gray-700 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
              placeholder="Search by Name or Patient ID"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Table */}
          <div className="overflow-x-auto bg-white rounded-2xl shadow-2xl">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-teal-100 text-gray-700">
                <tr>
                  <th
                    className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider cursor-pointer hover:bg-blue-100"
                    onClick={() => handleSort("pID")}
                  >
                    Patient ID
                  </th>
                  <th
                    className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider cursor-pointer hover:bg-blue-100"
                    onClick={() => handleSort("name")}
                  >
                    Name
                  </th>
                  <th
                    className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider cursor-pointer hover:bg-blue-100"
                    onClick={() => handleSort("age")}
                  >
                    Age
                  </th>
                  <th
                    className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider cursor-pointer hover:bg-blue-100"
                    onClick={() => handleSort("gender")}
                  >
                    Gender
                  </th>
                  <th
                    className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider cursor-pointer hover:bg-blue-100"
                    onClick={() => handleSort("phone_no")}
                  >
                    Phone
                  </th>
                  <th
                    className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider cursor-pointer hover:bg-blue-100"
                    onClick={() => handleSort("address")}
                  >
                    Address
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPatients.map((patient, index) => (
                  <tr
                    key={patient._id}
                    className={`${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-blue-50 transition-colors duration-200`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                      {patient.pID}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {patient.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {patient.age}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {patient.gender}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {patient.phone_no}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {patient.address}
                    </td>
                  </tr>
                ))}
                {filteredPatients.length === 0 && (
                  <tr>
                    <td
                      colSpan="6"
                      className="text-center text-gray-600 py-6 text-sm"
                    >
                      No patients found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default PatientRecords;
