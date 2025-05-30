// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import DentistNavbar from './DentistNavbar';
// import { useAuth } from "../contexts/AuthContext"; // Import useAuth to access dentistId
// import { FaUser, FaPhone, FaBriefcase, FaMedkit } from "react-icons/fa"; // Import icons

// const DentistProfile = () => {
//   const { dentistId } = useAuth(); // Access dentistId from AuthContext
//   const [formData, setFormData] = useState({
//     name: '',
//     phone_no: '',
//     experience: '',
//     specialization: '',
//   });
//   const [isUpdating, setIsUpdating] = useState(false); // Track if the profile already exists

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const response = await axios.get(`http://localhost:3000/api/profiles/dentist`, {
//           params: { dentistId } // Pass dentistId as query parameter
//         });

//         console.log(response); // Debug log the response to check the data structure

//         if (response.data && response.data.dentist) {
//           // Check if dentist profile exists
//           const profile = response.data.dentist; // Get the dentist data directly
//           setFormData({
//             name: profile.name,
//             phone_no: profile.phone_no,
//             experience: profile.experience,
//             specialization: profile.specialization,
//           });
//           setIsUpdating(true); // Profile exists, set to updating mode
//         } else {
//           // If no dentist profile exists, allow the user to create one
//           setIsUpdating(false); // Indicate that it's a creation process
//         }
//       } catch (error) {
//         console.error("Error fetching dentist profile:", error.response?.data || error.message);
//         toast.error(`Failed to fetch dentist profile: ${error.response?.data?.message || error.message}`);
//       }
//     };

//     if (dentistId) {
//       fetchProfile();
//     }
//   }, [dentistId]);

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       let response;

//       if (isUpdating) {
//         // Update existing profile
//         response = await axios.put('http://localhost:3000/api/profiles/dentist', {
//           ...formData,
//           dentistId, // Include dentistId in the payload
//         });
//       } else {
//         // Create new profile
//         response = await axios.post('http://localhost:3000/api/profiles/dentist', {
//           ...formData,
//           dentistId, // Include dentistId in the payload
//         });
//       }

//       console.log("Response:", response.data);

//       if (response.data && response.data.message) {
//         toast.success(response.data.message);
//         setIsUpdating(true); // Set updating mode to true if profile is created or updated
//       }
//     } catch (error) {
//       console.error("Error details:", error.response?.data || error.message);
//       toast.error(`Failed to ${isUpdating ? 'update' : 'create'} dentist profile: ${error.response?.data?.message || error.message}`);
//     }
//   };

//   return (
//     <>
//       <DentistNavbar />
//       <div className="flex justify-center items-center min-h-screen bg-white-100 px-5 ">
//         <div className="w-full p-4 px-[30] mb-6 border border-gray-300 rounded-md shadow-md hover:shadow-xl transition-shadow duration-300 mx-5 my-1.5">
//           <h2 className="text-2xl font-bold text-center text-teal-600">{isUpdating ? 'Update' : 'Create'} Your Profile</h2>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div className="flex items-center space-x-2 mx-2.5">
//               <FaUser className="text-teal-600" />
//               <label className="block text-gray-700">Name</label>
//             </div>
//             <input
//               type="text"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               className="w-full p-2 border border-gray-300 rounded"
//               required
//             />

//             <div className="flex items-center space-x-2 mx-2.5">
//               <FaPhone className="text-teal-600" />
//               <label className="block text-gray-700">Phone Number</label>
//             </div>
//             <input
//               type="text"
//               name="phone_no"
//               value={formData.phone_no}
//               onChange={handleChange}
//               className="w-full p-2 border border-gray-300 rounded"
//               required
//               maxLength={10}
//             />

//             <div className="flex items-center space-x-2 mx-2.5">
//               <FaBriefcase className="text-teal-600" />
//               <label className="block text-gray-700">Experience</label>
//             </div>
//             <input
//               name="experience"
//               value={formData.experience}
//               onChange={handleChange}
//               className="w-full p-2 border border-gray-300 rounded"
//               required
//             />

//             <div className="flex items-center space-x-2 mx-2.5">
//               <FaMedkit className="text-teal-600" />
//               <label className="block text-gray-700">Specialization</label>
//             </div>
//             <input
//               name="specialization"
//               value={formData.specialization}
//               onChange={handleChange}
//               className="w-full p-2 border border-gray-300 rounded"
//               required
//             />

//             <div className="flex justify-center">
//               <button
//               type="submit"
//               className={`${isUpdating ? 'bg-teal-500 hover:bg-green-400' : 'bg-teal-500 hover:bg-teal-400'} text-white py-3 px-10 text-lg rounded-md transition font-bold`}
//             >
//               {isUpdating ? 'Update' : 'Save'}
//             </button>
//             </div>

//           </form>
//         </div>
//       </div>
//     </>
//   );
// };

// export default DentistProfile;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import DentistNavbar from "./DentistNavbar";
import { useAuth } from "../contexts/AuthContext";
import { FaUser, FaPhone, FaBriefcase, FaMedkit } from "react-icons/fa";

const DentistProfile = () => {
  const { dentistId } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    phone_no: "",
    experience: "",
    specialization: "",
  });
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/profiles/dentist`,
          {
            params: { dentistId },
          }
        );

        if (response.data && response.data.dentist) {
          const profile = response.data.dentist;
          setFormData({
            name: profile.name,
            phone_no: profile.phone_no,
            experience: profile.experience,
            specialization: profile.specialization,
          });
          setIsUpdating(true);
        } else {
          setIsUpdating(false);
        }
      } catch (error) {
        console.error(
          "Error fetching dentist profile:",
          error.response?.data || error.message
        );
        toast.error(
          `Failed to fetch dentist profile: ${
            error.response?.data?.message || error.message
          }`
        );
      }
    };

    if (dentistId) {
      fetchProfile();
    }
  }, [dentistId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let response;
      if (isUpdating) {
        response = await axios.put(
          "http://localhost:3000/api/profiles/dentist",
          { ...formData, dentistId }
        );
      } else {
        response = await axios.post(
          "http://localhost:3000/api/profiles/dentist",
          { ...formData, dentistId }
        );
      }

      toast.success(response.data.message || "Profile saved successfully.");
      setIsUpdating(true);
    } catch (error) {
      toast.error(
        `Failed to ${isUpdating ? "update" : "create"} profile: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  return (
    <>
      <DentistNavbar />
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-teal-100 py-12 px-4">
        <div className="max-w-2xl mx-auto bg-white border border-gray-300 rounded-2xl shadow-2xl p-8">
          <h2 className="text-3xl font-extrabold text-teal-700 text-center mb-6">
            {isUpdating ? "Update" : "Create"} Your Profile
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="flex items-center text-sm font-semibold text-teal-900 mb-1">
                <FaUser className="text-teal-500 mr-2" /> Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-400 outline-none"
                required
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="flex items-center text-sm font-semibold text-teal-900 mb-1">
                <FaPhone className="text-teal-500 mr-2" /> Phone Number
              </label>
              <input
                type="text"
                name="phone_no"
                value={formData.phone_no}
                onChange={handleChange}
                maxLength={10}
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-400 outline-none"
                required
              />
            </div>

            {/* Experience */}
            <div>
              <label className="flex items-center text-sm font-semibold text-teal-900 mb-1">
                <FaBriefcase className="text-teal-500 mr-2" /> Experience
              </label>
              <input
                type="text"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-400 outline-none"
                required
              />
            </div>

            {/* Specialization */}
            <div>
              <label className="flex items-center text-sm font-semibold text-teal-900 mb-1">
                <FaMedkit className="text-teal-500 mr-2" /> Specialization
              </label>
              <input
                type="text"
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-400 outline-none"
                required
              />
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="w-full py-3 bg-teal-500 hover:bg-teal-600 text-white text-base font-semibold rounded-xl shadow-md transition duration-300"
              >
                {isUpdating ? "Update Profile" : "Create Profile"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default DentistProfile;
