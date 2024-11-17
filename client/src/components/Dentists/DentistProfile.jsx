// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import DentistNavbar from './DentistNavbar';
// import { useAuth } from "../contexts/AuthContext"; // Import useAuth to access dentistId

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
//       <div className="flex justify-center items-center min-h-screen bg-gray-100">
//         <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
//           <h2 className="text-2xl font-bold text-center">{isUpdating ? 'Update' : 'Create'} Dentist Profile</h2>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div>
//               <label className="block text-gray-700">Name</label>
//               <input
//                 type="text"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 className="w-full p-2 border border-gray-300 rounded"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-gray-700">Phone Number</label>
//               <input
//                 type="text"
//                 name="phone_no"
//                 value={formData.phone_no}
//                 onChange={handleChange}
//                 className="w-full p-2 border border-gray-300 rounded"
//                 required
//                 maxLength={10}
//               />
//             </div>
//             <div>
//               <label className="block text-gray-700">Experience</label>
//               <input
//                 name="experience"
//                 value={formData.experience}
//                 onChange={handleChange}
//                 className="w-full p-2 border border-gray-300 rounded"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-gray-700">Specialization</label>
//               <input
//                 name="specialization"
//                 value={formData.specialization}
//                 onChange={handleChange}
//                 className="w-full p-2 border border-gray-300 rounded"
//                 required
//               />
//             </div>
//             <button
//               type="submit"
//               className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
//             >
//               {isUpdating ? 'Update Profile' : 'Save Profile'}
//             </button>
//           </form>
//         </div>
//       </div>
//     </>
//   );
// };

// export default DentistProfile;

















import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import DentistNavbar from './DentistNavbar';
import { useAuth } from "../contexts/AuthContext"; // Import useAuth to access dentistId
import { FaUser, FaPhone, FaBriefcase, FaMedkit } from "react-icons/fa"; // Import icons

const DentistProfile = () => {
  const { dentistId } = useAuth(); // Access dentistId from AuthContext
  const [formData, setFormData] = useState({
    name: '',
    phone_no: '',
    experience: '',
    specialization: '',
  });
  const [isUpdating, setIsUpdating] = useState(false); // Track if the profile already exists

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/profiles/dentist`, {
          params: { dentistId } // Pass dentistId as query parameter
        });
  
        console.log(response); // Debug log the response to check the data structure
  
        if (response.data && response.data.dentist) {
          // Check if dentist profile exists
          const profile = response.data.dentist; // Get the dentist data directly
          setFormData({
            name: profile.name,
            phone_no: profile.phone_no,
            experience: profile.experience,
            specialization: profile.specialization,
          });
          setIsUpdating(true); // Profile exists, set to updating mode
        } else {
          // If no dentist profile exists, allow the user to create one
          setIsUpdating(false); // Indicate that it's a creation process
        }
      } catch (error) {
        console.error("Error fetching dentist profile:", error.response?.data || error.message);
        toast.error(`Failed to fetch dentist profile: ${error.response?.data?.message || error.message}`);
      }
    };
  
    if (dentistId) {
      fetchProfile();
    }
  }, [dentistId]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let response;

      if (isUpdating) {
        // Update existing profile
        response = await axios.put('http://localhost:3000/api/profiles/dentist', {
          ...formData,
          dentistId, // Include dentistId in the payload
        });
      } else {
        // Create new profile
        response = await axios.post('http://localhost:3000/api/profiles/dentist', {
          ...formData,
          dentistId, // Include dentistId in the payload
        });
      }

      console.log("Response:", response.data);
      
      if (response.data && response.data.message) {
        toast.success(response.data.message);
        setIsUpdating(true); // Set updating mode to true if profile is created or updated
      }
    } catch (error) {
      console.error("Error details:", error.response?.data || error.message);
      toast.error(`Failed to ${isUpdating ? 'update' : 'create'} dentist profile: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <>
      <DentistNavbar />
      <div className="flex justify-center items-center min-h-screen bg-gray-100 px-5"> {/* Added px-5 for 20px padding on both sides */}
        <div className="w-full max-w-4xl p-8 space-y-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center text-teal-600">{isUpdating ? 'Update' : 'Create'} Dentist Profile</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center space-x-2">
              <FaUser className="text-teal-600" />
              <label className="block text-gray-700">Name</label>
            </div>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />

            <div className="flex items-center space-x-2">
              <FaPhone className="text-teal-600" />
              <label className="block text-gray-700">Phone Number</label>
            </div>
            <input
              type="text"
              name="phone_no"
              value={formData.phone_no}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
              maxLength={10}
            />

            <div className="flex items-center space-x-2">
              <FaBriefcase className="text-teal-600" />
              <label className="block text-gray-700">Experience</label>
            </div>
            <input
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />

            <div className="flex items-center space-x-2">
              <FaMedkit className="text-teal-600" />
              <label className="block text-gray-700">Specialization</label>
            </div>
            <input
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />

            <button
              type="submit"
              className={`w-full ${isUpdating ? 'bg-green-500 hover:bg-green-400' : 'bg-teal-500 hover:bg-teal-400'} text-white py-2 rounded-md transition`}
            >
              {isUpdating ? 'Update Profile' : 'Save Profile'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default DentistProfile;
