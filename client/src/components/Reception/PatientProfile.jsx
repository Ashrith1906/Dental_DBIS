// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { useAuth } from "../contexts/AuthContext";

// const PatientProfile = () => {
//   const { patientId } = useAuth(); // get patientId from AuthContext
//   const [formData, setFormData] = useState({
//     name: "",
//     dob: "",
//     gender: "",
//     phone_no: "",
//     past_history: "",
//     current_status: "",
//     address: "",
//   });
//   const [isUpdating, setIsUpdating] = useState(false);

//   // Calculate age from DOB
//   const calculateAge = (dob) => {
//     if (!dob) return "";
//     const birthDate = new Date(dob);
//     const today = new Date();
//     let age = today.getFullYear() - birthDate.getFullYear();
//     const m = today.getMonth() - birthDate.getMonth();
//     if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
//       age--;
//     }
//     return age;
//   };

//   useEffect(() => {
//     const fetchPatient = async () => {
//       try {
//         const response = await axios.get(
//           "http://localhost:3000/api/patients/patient",
//           {
//             params: { pID: patientId },
//           }
//         );

//         if (response.data && response.data.patient) {
//           const patient = response.data.patient;
//           setFormData({
//             name: patient.name || "",
//             dob: patient.dob ? patient.dob.split("T")[0] : "", // format date YYYY-MM-DD
//             gender: patient.gender || "",
//             phone_no: patient.phone_no || "",
//             past_history: patient.past_history || "",
//             current_status: patient.current_status || "",
//             address: patient.address || "",
//           });
//           setIsUpdating(true);
//         } else {
//           setIsUpdating(false);
//         }
//       } catch (error) {
//         console.error("Error fetching patient profile:", error.response?.data || error.message);
//         toast.error(`Failed to fetch patient profile: ${error.response?.data?.message || error.message}`);
//       }
//     };

//     if (patientId) {
//       fetchPatient();
//     }
//   }, [patientId]);

//   const handleChange = (e) => {
//     setFormData((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Calculate age before sending
//     const age = calculateAge(formData.dob);

//     // Validate required fields on client side
//     if (
//       !formData.name ||
//       !formData.dob ||
//       !formData.gender ||
//       !formData.phone_no ||
//       !formData.past_history ||
//       !formData.current_status ||
//       !formData.address
//     ) {
//       toast.error("Please fill all required fields");
//       return;
//     }

//     if (!/^\d{10}$/.test(formData.phone_no)) {
//       toast.error("Phone number must be a 10-digit number");
//       return;
//     }

//     try {
//       let response;

//       if (isUpdating) {
//         // Update existing patient profile
//         response = await axios.put(
//           "http://localhost:3000/api/patients/patient",
//           {
//             ...formData,
//             age,
//           },
//           { params: { pID: patientId } }
//         );
//       } else {
//         // Create new patient profile
//         response = await axios.post("http://localhost:3000/api/patients", {
//           ...formData,
//           age,
//         });
//       }

//       if (response.data && response.data.message) {
//         toast.success(response.data.message);
//         setIsUpdating(true);
//       }
//     } catch (error) {
//       console.error("Error details:", error.response?.data || error.message);
//       toast.error(
//         `Failed to ${isUpdating ? "update" : "create"} patient profile: ${
//           error.response?.data?.message || error.message
//         }`
//       );
//     }
//   };

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-white px-5">
//       <div className="w-full max-w-xl p-6 border border-gray-300 rounded-md shadow-md hover:shadow-xl transition-shadow duration-300">
//         <h2 className="text-2xl font-bold text-center text-teal-600 mb-6">
//           {isUpdating ? "Update" : "Create"} Your Profile
//         </h2>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           {/* Name */}
//           <label className="block text-gray-700">Name *</label>
//           <input
//             type="text"
//             name="name"
//             value={formData.name}
//             onChange={handleChange}
//             className="w-full p-2 border border-gray-300 rounded"
//             required
//           />

//           {/* DOB */}
//           <label className="block text-gray-700">Date of Birth *</label>
//           <input
//             type="date"
//             name="dob"
//             value={formData.dob}
//             onChange={handleChange}
//             className="w-full p-2 border border-gray-300 rounded"
//             required
//           />

//           {/* Age - read only
//           <label className="block text-gray-700">Age</label>
//           <input
//             type="number"
//             name="age"
//             value={calculateAge(formData.dob)}
//             readOnly
//             className="w-full p-2 border border-gray-300 rounded bg-gray-100 cursor-not-allowed"
//           /> */}

//           {/* Gender */}
//           <label className="block text-gray-700">Gender *</label>
//           <select
//             name="gender"
//             value={formData.gender}
//             onChange={handleChange}
//             className="w-full p-2 border border-gray-300 rounded"
//             required
//           >
//             <option value="">Select Gender</option>
//             <option value="Male">Male</option>
//             <option value="Female">Female</option>
//             <option value="Other">Other</option>
//           </select>

//           {/* Phone Number */}
//           <label className="block text-gray-700">Phone Number *</label>
//           <input
//             type="text"
//             name="phone_no"
//             value={formData.phone_no}
//             onChange={handleChange}
//             className="w-full p-2 border border-gray-300 rounded"
//             maxLength={10}
//             required
//           />

//           {/* Past History */}
//           <label className="block text-gray-700">Past History *</label>
//           <textarea
//             name="past_history"
//             value={formData.past_history}
//             onChange={handleChange}
//             className="w-full p-2 border border-gray-300 rounded"
//             required
//             rows={3}
//           />

//           {/* Current Status */}
//           <label className="block text-gray-700">Current Status *</label>
//           <textarea
//             name="current_status"
//             value={formData.current_status}
//             onChange={handleChange}
//             className="w-full p-2 border border-gray-300 rounded"
//             required
//             rows={3}
//           />

//           {/* Address */}
//           <label className="block text-gray-700">Address *</label>
//           <textarea
//             name="address"
//             value={formData.address}
//             onChange={handleChange}
//             className="w-full p-2 border border-gray-300 rounded"
//             required
//             rows={3}
//           />

//           <div className="flex justify-center mt-4">
//             <button
//               type="submit"
//               className="bg-teal-500 hover:bg-teal-400 text-white py-3 px-10 text-lg rounded-md font-bold transition"
//             >
//               {isUpdating ? "Update" : "Save"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default PatientProfile;

import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import ReceptionNavbar from "./ReceptionNavbar";

const PatientProfile = () => {
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    gender: "",
    phone_no: "",
    past_history: "",
    current_status: "",
    address: "",
  });

  const calculateAge = (dob) => {
    if (!dob) return "";
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const age = calculateAge(formData.dob);

    if (
      !formData.name ||
      !formData.dob ||
      !formData.gender ||
      !formData.phone_no ||
      !formData.past_history ||
      !formData.current_status ||
      !formData.address
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    if (!/^\d{10}$/.test(formData.phone_no)) {
      toast.error("Phone number must be a 10-digit number");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/api/patient", {
        ...formData,
        age,
      });

      if (response.data?.message) {
        toast.success(response.data.message);
        setFormData({
          name: "",
          dob: "",
          gender: "",
          phone_no: "",
          past_history: "",
          current_status: "",
          address: "",
        });
      }
    } catch (error) {
      console.error("Error details:", error.response?.data || error.message);
      toast.error(
        `Failed to create patient profile: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-100">
      <ReceptionNavbar />
      <div className="flex justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-3xl font-extrabold text-teal-700 text-center mb-6">
            Create Patient Profile
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Form Fields */}
            {[
              { label: "Full Name", name: "name", type: "text" },
              { label: "Date of Birth", name: "dob", type: "date" },
              {
                label: "Phone Number",
                name: "phone_no",
                type: "text",
                maxLength: 10,
              },
            ].map(({ label, name, type, ...rest }) => (
              <div key={name}>
                <label className="block text-sm font-medium text-teal-900">
                  {label} *
                </label>
                <input
                  type={type}
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  className="mt-1 w-full p-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400"
                  required
                  {...rest}
                />
              </div>
            ))}

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-teal-900">
                Gender *
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="mt-1 w-full p-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400"
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Textareas */}
            {[
              { label: "Past History", name: "past_history" },
              { label: "Current Status", name: "current_status" },
              { label: "Address", name: "address" },
            ].map(({ label, name }) => (
              <div key={name}>
                <label className="block text-sm font-medium text-teal-900">
                  {label} *
                </label>
                <textarea
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  rows={3}
                  className="mt-1 w-full p-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400"
                  required
                />
              </div>
            ))}

            {/* Submit */}
            <div className="flex justify-center mt-6">
              <button
                type="submit"
                className="w-full sm:w-auto bg-teal-500 hover:bg-teal-600 text-white font-semibold text-base py-3 px-8 rounded-xl shadow-md transition-all duration-300"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;
