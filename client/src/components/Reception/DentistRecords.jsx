// import { useState, useEffect } from "react";
// import axios from "axios";
// import ReceptionNavbar from "./ReceptionNavbar";
// import { FaSearch } from "react-icons/fa";
// import { Loader2 } from "lucide-react";
// import Footer from "../Footer";

// const DentistRecords = () => {
//   const [dentists, setDentists] = useState([]);
//   const [filteredDentists, setFilteredDentists] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [sortConfig, setSortConfig] = useState({
//     key: "name",
//     direction: "asc",
//   });

//   const fetchDentists = async () => {
//     try {
//       const response = await axios.get(
//         `${import.meta.env.VITE_API_BASE_URL}profiles/getAllDentists`
//       );
//       setDentists(response.data.dentists);
//       setFilteredDentists(response.data.dentists);
//       setLoading(false);
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to fetch dentists");
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchDentists();
//   }, []);

//   useEffect(() => {
//     const result = dentists.filter(
//       (dentist) =>
//         dentist.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         dentist.dentistId?.toString().includes(searchTerm)
//     );
//     setFilteredDentists(result);
//   }, [searchTerm, dentists]);

//   const handleSort = (key) => {
//     let direction = "asc";
//     if (sortConfig.key === key && sortConfig.direction === "asc")
//       direction = "desc";
//     setSortConfig({ key, direction });

//     const sorted = [...filteredDentists].sort((a, b) => {
//       if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
//       if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
//       return 0;
//     });

//     setFilteredDentists(sorted);
//   };

//   if (loading) {
//     return (
//       <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-teal-100">
//         <Loader2 className="w-10 h-10 text-teal-600 animate-spin mb-4" />
//         <p className="text-xl font-semibold text-teal-700">
//           Loading patients...
//         </p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <p className="text-xl font-semibold text-red-500">{error}</p>
//       </div>
//     );
//   }

//   return (
//     <>
//       <ReceptionNavbar />
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-100 p-8">
//         <div className="max-w-7xl mx-auto">
//           <h1 className="text-3xl font-extrabold text-teal-700 text-center mb-6">
//             Dentist Records
//           </h1>

//           {/* Search Bar */}
//           <div className="flex justify-end mb-6">
//             <div className="relative w-full sm:w-1/3">
//               <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
//                 <FaSearch />
//               </span>
//               <input
//                 type="text"
//                 className="w-full pl-10 pr-4 py-3 bg-gray-50 text-gray-700 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
//                 placeholder="Search by Name or Dentist ID"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>
//           </div>

//           {/* Table */}
//           <div className="overflow-x-auto bg-white rounded-2xl shadow-2xl">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-teal-100 text-gray-700">
//                 <tr>
//                   {[
//                     { key: "dentistId", label: "ID" },
//                     { key: "name", label: "Name" },
//                     { key: "specialization", label: "Specialization" },
//                     { key: "experience", label: "Experience" },
//                     { key: "phone_no", label: "Phone" },
//                     { key: "email", label: "Email" },
//                   ].map(({ key, label }) => (
//                     <th
//                       key={key}
//                       className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider cursor-pointer hover:bg-blue-100"
//                       onClick={() => handleSort(key)}
//                     >
//                       {label}
//                       {sortConfig.key === key && (
//                         <span className="ml-2">
//                           {sortConfig.direction === "asc" ? "▲" : "▼"}
//                         </span>
//                       )}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {filteredDentists.map((dentist, index) => (
//                   <tr
//                     key={dentist._id}
//                     className={`${
//                       index % 2 === 0 ? "bg-gray-50" : "bg-white"
//                     } hover:bg-blue-50 transition-colors duration-200`}
//                   >
//                     <td className="px-6 py-4 text-sm text-gray-700 font-medium">
//                       {dentist.dentistId}
//                     </td>
//                     <td className="px-6 py-4 text-sm text-gray-700">
//                       {dentist.name}
//                     </td>
//                     <td className="px-6 py-4 text-sm text-gray-700">
//                       {dentist.specialization}
//                     </td>
//                     <td className="px-6 py-4 text-sm text-gray-700">
//                       {dentist.experience} yrs
//                     </td>
//                     <td className="px-6 py-4 text-sm text-gray-700">
//                       {dentist.phone_no}
//                     </td>
//                     <td className="px-6 py-4 text-sm text-gray-700">
//                       {dentist.email}
//                     </td>
//                   </tr>
//                 ))}
//                 {filteredDentists.length === 0 && (
//                   <tr>
//                     <td
//                       colSpan="6"
//                       className="text-center text-gray-600 py-6 text-sm"
//                     >
//                       No dentists found matching your search.
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//       <Footer/>
//     </>
//   );
// };

// export default DentistRecords;

import { useState, useEffect } from "react";
import axios from "axios";
import ReceptionNavbar from "./ReceptionNavbar";
import { FaSearch } from "react-icons/fa";
import { Loader2 } from "lucide-react";
import Footer from "../Footer";

const DentistRecords = () => {
  const [dentists, setDentists] = useState([]);
  const [filteredDentists, setFilteredDentists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;

  const fetchDentists = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}profiles/getAllDentists`
      );
      setDentists(response.data.dentists);
      setFilteredDentists(response.data.dentists);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch dentists");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDentists();
  }, []);

  useEffect(() => {
    const result = dentists.filter(
      (dentist) =>
        dentist.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dentist.dentistId?.toString().includes(searchTerm)
    );
    setFilteredDentists(result);
    setCurrentPage(1); // Reset to page 1 when search term changes
  }, [searchTerm, dentists]);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc")
      direction = "desc";
    setSortConfig({ key, direction });

    const sorted = [...filteredDentists].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredDentists(sorted);
  };

  // Pagination Logic
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentDentists = filteredDentists.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredDentists.length / recordsPerPage);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-teal-100">
        <Loader2 className="w-10 h-10 text-teal-600 animate-spin mb-4" />
        <p className="text-xl font-semibold text-teal-700">Loading dentists...</p>
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
            Dentist Records
          </h1>

          {/* Search Bar */}
          <div className="flex justify-end mb-6">
            <div className="relative w-full sm:w-1/3">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <FaSearch />
              </span>
              <input
                type="text"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 text-gray-700 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                placeholder="Search by Name or Dentist ID"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto bg-white rounded-2xl shadow-2xl">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-teal-100 text-gray-700">
                <tr>
                  {[
                    { key: "dentistId", label: "ID" },
                    { key: "name", label: "Name" },
                    { key: "specialization", label: "Specialization" },
                    { key: "experience", label: "Experience" },
                    { key: "phone_no", label: "Phone" },
                    { key: "email", label: "Email" },
                  ].map(({ key, label }) => (
                    <th
                      key={key}
                      className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider cursor-pointer hover:bg-blue-100"
                      onClick={() => handleSort(key)}
                    >
                      {label}
                      {sortConfig.key === key && (
                        <span className="ml-2">
                          {sortConfig.direction === "asc" ? "▲" : "▼"}
                        </span>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentDentists.map((dentist, index) => (
                  <tr
                    key={dentist._id}
                    className={`${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-blue-50 transition-colors duration-200`}
                  >
                    <td className="px-6 py-4 text-sm text-gray-700 font-medium">
                      {dentist.dentistId}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {dentist.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {dentist.specialization}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {dentist.experience} yrs
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {dentist.phone_no}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {dentist.email}
                    </td>
                  </tr>
                ))}
                {currentDentists.length === 0 && (
                  <tr>
                    <td
                      colSpan="6"
                      className="text-center text-gray-600 py-6 text-sm"
                    >
                      No dentists found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6 space-x-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    page === currentPage
                      ? "bg-teal-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-teal-100"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default DentistRecords;