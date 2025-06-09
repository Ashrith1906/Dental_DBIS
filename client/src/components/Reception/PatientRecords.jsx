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

  useEffect(() => {
    const result = patients.filter(
      (patient) =>
        patient.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.pID?.toString().includes(searchTerm)
    );
    setFilteredPatients(result);
  }, [searchTerm, patients]);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
    const sorted = [...filteredPatients].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });
    setFilteredPatients(sorted);
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-teal-100">
        {/* Spinner */}
        <div className="w-12 h-12 border-4 border-blue-300 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-xl font-semibold text-blue-500">
          Loading patients...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-teal-100">
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

          {/* Search */}
          <div className="flex justify-end mb-6">
            <input
              type="text"
              placeholder="Search by Name or Patient ID"
              className="w-full sm:w-1/3 p-3 bg-gray-50 text-gray-700 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Table */}
          <div className="overflow-x-auto bg-white rounded-2xl shadow-2xl">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-teal-100 text-gray-700">
                <tr>
                  {[
                    { key: "pID", label: "Patient ID" },
                    { key: "name", label: "Name" },
                    { key: "age", label: "Age" },
                    { key: "gender", label: "Gender" },
                    { key: "phone_no", label: "Phone" },
                    { key: "address", label: "Address" },
                  ].map(({ key, label }) => (
                    <th
                      key={key}
                      onClick={() => handleSort(key)}
                      className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider cursor-pointer hover:bg-blue-100"
                    >
                      {label}
                      {sortConfig.key === key && (
                        <span className="ml-1 text-emerald-600">
                          {sortConfig.direction === "asc" ? "▲" : "▼"}
                        </span>
                      )}
                    </th>
                  ))}
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
                    <td className="px-6 py-4 text-sm text-gray-700 font-medium">
                      {patient.pID}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {patient.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {patient.age}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {patient.gender}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {patient.phone_no}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
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
