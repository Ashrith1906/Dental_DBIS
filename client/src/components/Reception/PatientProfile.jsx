// // import React, { useState } from 'react';
// // import axios from 'axios';
// // import { toast } from 'react-toastify';
// // import ReceptionNavbar from './ReceptionNavbar'

// // const PatientProfile = () => {
// //   const [formData, setFormData] = useState({
// //     name: '',
// //     dob: '',
// //     age: '',
// //     gender: '',
// //     phone_no: '',
// //     past_history: '',
// //     current_status: '',
// //     address: '',
// //     dentistId: '',
// //   });

// //   const handleChange = (e) => {
// //     setFormData({
// //       ...formData,
// //       [e.target.name]: e.target.value,
// //     });
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();

// //     try {
// //       const response = await axios.post('http://localhost:3000/api/patient/create', formData);
// //       if (response.data && response.data.message === "Patient data saved successfully") {
// //         toast.success('Patient profile created successfully!');
// //         setFormData({
// //           name: '',
// //           dob: '',
// //           age: '',
// //           gender: '',
// //           phone_no: '',
// //           past_history: '',
// //           current_status: '',
// //           address: '',
// //           dentistId: '',
// //         });
// //       }
// //     } catch (error) {
// //       toast.error(`Failed to create patient profile: ${error.response?.data?.message || error.message}`);
// //     }
// //   };

// //   return (
// //     <>
// //     <ReceptionNavbar/>
// //     <div className="flex justify-center items-center min-h-screen bg-gray-100">
// //       <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
// //         <h2 className="text-2xl font-bold text-center">Create Patient Profile</h2>
// //         <form onSubmit={handleSubmit} className="space-y-4">
// //           <div>
// //             <label className="block text-gray-700">Name</label>
// //             <input
// //               type="text"
// //               name="name"
// //               value={formData.name}
// //               onChange={handleChange}
// //               className="w-full p-2 border border-gray-300 rounded"
// //               required
// //             />
// //           </div>

// //           <div>
// //             <label className="block text-gray-700">Date of Birth</label>
// //             <input
// //               type="date"
// //               name="dob"
// //               value={formData.dob}
// //               onChange={handleChange}
// //               className="w-full p-2 border border-gray-300 rounded"
// //               required
// //             />
// //           </div>

// //           <div>
// //             <label className="block text-gray-700">Age</label>
// //             <input
// //               type="number"
// //               name="age"
// //               value={formData.age}
// //               onChange={handleChange}
// //               className="w-full p-2 border border-gray-300 rounded"
// //               required
// //             />
// //           </div>

// //           <div>
// //             <label className="block text-gray-700">Gender</label>
// //             <select
// //               name="gender"
// //               value={formData.gender}
// //               onChange={handleChange}
// //               className="w-full p-2 border border-gray-300 rounded"
// //               required
// //             >
// //               <option value="">Select Gender</option>
// //               <option value="Male">Male</option>
// //               <option value="Female">Female</option>
// //               <option value="Other">Other</option>
// //             </select>
// //           </div>

// //           <div>
// //             <label className="block text-gray-700">Phone Number</label>
// //             <input
// //               type="text"
// //               name="phone_no"
// //               value={formData.phone_no}
// //               onChange={handleChange}
// //               className="w-full p-2 border border-gray-300 rounded"
// //               required
// //               maxLength={10}
// //             />
// //           </div>

// //           <div>
// //             <label className="block text-gray-700">Past History</label>
// //             <textarea
// //               name="past_history"
// //               value={formData.past_history}
// //               onChange={handleChange}
// //               className="w-full p-2 border border-gray-300 rounded"
// //               required
// //             ></textarea>
// //           </div>

// //           <div>
// //             <label className="block text-gray-700">Current Status</label>
// //             <textarea
// //               name="current_status"
// //               value={formData.current_status}
// //               onChange={handleChange}
// //               className="w-full p-2 border border-gray-300 rounded"
// //               required
// //             ></textarea>
// //           </div>

// //           <div>
// //             <label className="block text-gray-700">Address</label>
// //             <textarea
// //               name="address"
// //               value={formData.address}
// //               onChange={handleChange}
// //               className="w-full p-2 border border-gray-300 rounded"
// //               required
// //             ></textarea>
// //           </div>

// //           <div>
// //             <label className="block text-gray-700">Dentist ID</label>
// //             <input
// //               type="text"
// //               name="dentistId"
// //               value={formData.dentistId}
// //               onChange={handleChange}
// //               className="w-full p-2 border border-gray-300 rounded"
// //               required
// //             />
// //           </div>

// //           <button
// //             type="submit"
// //             className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
// //           >
// //             Save Profile
// //           </button>
// //         </form>
// //       </div>
// //     </div>
// //     </>
// //   );
// // };

// // export default PatientProfile;











// // import React, { useState } from 'react';
// // import axios from 'axios';
// // import { toast } from 'react-toastify';
// // import ReceptionNavbar from './ReceptionNavbar';

// // const PatientProfile = () => {
// //   const [formData, setFormData] = useState({
// //     name: '',
// //     dob: '',
// //     age: '',
// //     gender: '',
// //     phone_no: '',
// //     past_history: '',
// //     current_status: '',
// //     address: '',
// //     dentistId: '',
// //   });

// //   const handleChange = (e) => {
// //     setFormData({
// //       ...formData,
// //       [e.target.name]: e.target.value,
// //     });
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();

// //     try {
// //       const response = await axios.post('http://localhost:3000/api/patient/create', formData);
// //       if (response.data && response.data.message === "Patient data saved successfully") {
// //         toast.success('Patient profile created successfully!');
// //         setFormData({
// //           name: '',
// //           dob: '',
// //           age: '',
// //           gender: '',
// //           phone_no: '',
// //           past_history: '',
// //           current_status: '',
// //           address: '',
// //           dentistId: '',
// //         });
// //       }
// //     } catch (error) {
// //       toast.error(`Failed to create patient profile: ${error.response?.data?.message || error.message}`);
// //     }
// //   };

// //   return (
// //     <>
// //       <ReceptionNavbar />
// //       <div className="flex justify-center items-center min-h-screen bg-gray-100">
// //         <div className="w-full max-w-md p-80 space-y-6 bg-white">
// //           <div className="max-w-4xl mx-auto p-8 space-y-6 bg-white">
// //             <h1 className="text-2xl font-bold text-center text-teal-700">Create Patient Profile</h1>
// //             <form onSubmit={handleSubmit} className="space-y-4">
// //               <div>
// //                 <label className="block text-teal-700">Name</label>
// //                 <input
// //                   type="text"
// //                   name="name"
// //                   value={formData.name}
// //                   onChange={handleChange}
// //                   className="w-full p-2 border border-teal-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-400"
// //                   required
// //                 />
// //               </div>

// //               <div>
// //                 <label className="block text-teal-700">Date of Birth</label>
// //                 <input
// //                   type="date"
// //                   name="dob"
// //                   value={formData.dob}
// //                   onChange={handleChange}
// //                   className="w-full p-2 border border-teal-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-400"
// //                   required
// //                 />
// //               </div>

// //               <div>
// //                 <label className="block text-teal-700">Age</label>
// //                 <input
// //                   type="number"
// //                   name="age"
// //                   value={formData.age}
// //                   onChange={handleChange}
// //                   className="w-full p-2 border border-teal-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-400"
// //                   required
// //                 />
// //               </div>

// //               <div>
// //                 <label className="block text-teal-700">Gender</label>
// //                 <select
// //                   name="gender"
// //                   value={formData.gender}
// //                   onChange={handleChange}
// //                   className="w-full p-2 border border-teal-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-400"
// //                   required
// //                 >
// //                   <option value="">Select Gender</option>
// //                   <option value="Male">Male</option>
// //                   <option value="Female">Female</option>
// //                   <option value="Other">Other</option>
// //                 </select>
// //               </div>

// //               <div>
// //                 <label className="block text-teal-700">Phone Number</label>
// //                 <input
// //                   type="text"
// //                   name="phone_no"
// //                   value={formData.phone_no}
// //                   onChange={handleChange}
// //                   className="w-full p-2 border border-teal-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-400"
// //                   required
// //                   maxLength={10}
// //                 />
// //               </div>

// //               <div>
// //                 <label className="block text-teal-700">Past History</label>
// //                 <textarea
// //                   name="past_history"
// //                   value={formData.past_history}
// //                   onChange={handleChange}
// //                   className="w-full p-2 border border-teal-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-400"
// //                   required
// //                 ></textarea>
// //               </div>

// //               <div>
// //                 <label className="block text-teal-700">Current Status</label>
// //                 <textarea
// //                   name="current_status"
// //                   value={formData.current_status}
// //                   onChange={handleChange}
// //                   className="w-full p-2 border border-teal-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-400"
// //                   required
// //                 ></textarea>
// //               </div>

// //               <div>
// //                 <label className="block text-teal-700">Address</label>
// //                 <textarea
// //                   name="address"
// //                   value={formData.address}
// //                   onChange={handleChange}
// //                   className="w-full p-2 border border-teal-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-400"
// //                   required
// //                 ></textarea>
// //               </div>

// //               <div>
// //                 <label className="block text-teal-700">Dentist ID</label>
// //                 <input
// //                   type="text"
// //                   name="dentistId"
// //                   value={formData.dentistId}
// //                   onChange={handleChange}
// //                   className="w-full p-2 border border-teal-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-400"
// //                   required
// //                 />
// //               </div>

// //               <button
// //                 type="submit"
// //                 className="w-full bg-teal-600 text-white py-2 rounded-md transition"
// //               >
// //                 Save Profile
// //               </button>
// //             </form>
// //           </div>
// //         </div>
// //       </div>
// //     </>
// //   );
// // };

// // export default PatientProfile;








// import React, { useState } from 'react';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import ReceptionNavbar from './ReceptionNavbar';

// const PatientProfile = () => {
//   const [formData, setFormData] = useState({
//     name: '',
//     dob: '',
//     age: '',
//     gender: '',
//     phone_no: '',
//     past_history: '',
//     current_status: '',
//     address: '',
//     dentistId: '',
//   });

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await axios.post('http://localhost:3000/api/patient/create', formData);
//       if (response.data && response.data.message === "Patient data saved successfully") {
//         toast.success('Patient profile created successfully!');
//         setFormData({
//           name: '',
//           dob: '',
//           age: '',
//           gender: '',
//           phone_no: '',
//           past_history: '',
//           current_status: '',
//           address: '',
//           dentistId: '',
//         });
//       }
//     } catch (error) {
//       toast.error(`Failed to create patient profile: ${error.response?.data?.message || error.message}`);
//     }
//   };

//   return (
//     <>
//       <ReceptionNavbar />
//       <div className="flex justify-center items-center min-h-screen bg-gray-100 pt-20">
//         <div className="w-full max-w-4xl p-5 bg-white h-full mx-5">
//           <div className="max-w-4xl mx-auto p-8 space-y-6 bg-white">
//             <h1 className="text-2xl font-bold text-center text-teal-700">Create Patient Profile</h1>
//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div>
//                 <label className="block text-teal-700">Name</label>
//                 <input
//                   type="text"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleChange}
//                   className="w-full p-2 border border-teal-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-400"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block text-teal-700">Date of Birth</label>
//                 <input
//                   type="date"
//                   name="dob"
//                   value={formData.dob}
//                   onChange={handleChange}
//                   className="w-full p-2 border border-teal-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-400"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block text-teal-700">Age</label>
//                 <input
//                   type="number"
//                   name="age"
//                   value={formData.age}
//                   onChange={handleChange}
//                   className="w-full p-2 border border-teal-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-400"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block text-teal-700">Gender</label>
//                 <select
//                   name="gender"
//                   value={formData.gender}
//                   onChange={handleChange}
//                   className="w-full p-2 border border-teal-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-400"
//                   required
//                 >
//                   <option value="">Select Gender</option>
//                   <option value="Male">Male</option>
//                   <option value="Female">Female</option>
//                   <option value="Other">Other</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-teal-700">Phone Number</label>
//                 <input
//                   type="text"
//                   name="phone_no"
//                   value={formData.phone_no}
//                   onChange={handleChange}
//                   className="w-full p-2 border border-teal-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-400"
//                   required
//                   maxLength={10}
//                 />
//               </div>

//               <div>
//                 <label className="block text-teal-700">Past History</label>
//                 <textarea
//                   name="past_history"
//                   value={formData.past_history}
//                   onChange={handleChange}
//                   className="w-full p-2 border border-teal-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-400"
//                   required
//                 ></textarea>
//               </div>

//               <div>
//                 <label className="block text-teal-700">Current Status</label>
//                 <textarea
//                   name="current_status"
//                   value={formData.current_status}
//                   onChange={handleChange}
//                   className="w-full p-2 border border-teal-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-400"
//                   required
//                 ></textarea>
//               </div>

//               <div>
//                 <label className="block text-teal-700">Address</label>
//                 <textarea
//                   name="address"
//                   value={formData.address}
//                   onChange={handleChange}
//                   className="w-full p-2 border border-teal-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-400"
//                   required
//                 ></textarea>
//               </div>

//               <div>
//                 <label className="block text-teal-700">Dentist ID</label>
//                 <input
//                   type="text"
//                   name="dentistId"
//                   value={formData.dentistId}
//                   onChange={handleChange}
//                   className="w-full p-2 border border-teal-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-400"
//                   required
//                 />
//               </div>

//               <button
//                 type="submit"
//                 className="w-full bg-teal-600 text-white py-2 rounded-md transition"
//               >
//                 Save Profile
//               </button>
//             </form>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default PatientProfile;











// import React, { useState } from 'react';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import { FaUser, FaCalendar, FaVenusMars, FaPhone, FaHistory, FaHeartbeat, FaMapMarkedAlt, FaTooth } from "react-icons/fa";
// import ReceptionNavbar from './ReceptionNavbar';

// const PatientProfile = () => {
//   const [formData, setFormData] = useState({
//     name: '',
//     dob: '',
//     age: '',
//     gender: '',
//     phone_no: '',
//     past_history: '',
//     current_status: '',
//     address: '',
//     dentistId: '',
//   });

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await axios.post('http://localhost:3000/api/patient/create', formData);
//       if (response.data && response.data.message === "Patient data saved successfully") {
//         toast.success('Patient profile created successfully!');
//         setFormData({
//           name: '',
//           dob: '',
//           age: '',
//           gender: '',
//           phone_no: '',
//           past_history: '',
//           current_status: '',
//           address: '',
//           dentistId: '',
//         });
//       }
//     } catch (error) {
//       toast.error(`Failed to create patient profile: ${error.response?.data?.message || error.message}`);
//     }
//   };

//   return (
//     <>
//       <ReceptionNavbar />
//       <div className="flex justify-center items-center min-h-screen bg-gray-100">
//         <div className="w-full max-w-4xl mx-5 p-8 bg-white border border-gray-300 shadow-md hover:shadow-xl transition-shadow duration-300">
//           <h1 className="text-2xl font-bold text-center text-teal-700">Create Patient Profile</h1>
//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* Name */}
//             <div>
//               <label className="block text-teal-700">Name</label>
//               <div className="flex items-center border border-teal-300 rounded focus-within:ring-2 focus-within:ring-teal-400">
//                 <FaUser className="ml-3" />
//                 <input
//                   type="text"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleChange}
//                   className="w-full p-2 focus:outline-none"
//                   required
//                 />
//               </div>
//             </div>

//             {/* Date of Birth */}
//             <div>
//               <label className="block text-teal-700">Date of Birth</label>
//               <div className="flex items-center border border-teal-300 rounded focus-within:ring-2 focus-within:ring-teal-400">
//                 <FaCalendar className="ml-3" />
//                 <input
//                   type="date"
//                   name="dob"
//                   value={formData.dob}
//                   onChange={handleChange}
//                   className="w-full p-2 focus:outline-none"
//                   required
//                 />
//               </div>
//             </div>

//             {/* Gender */}
//             <div>
//               <label className="block text-teal-700">Gender</label>
//               <div className="flex items-center border border-teal-300 rounded focus-within:ring-2 focus-within:ring-teal-400">
//                 <FaVenusMars className="ml-3" />
//                 <select
//                   name="gender"
//                   value={formData.gender}
//                   onChange={handleChange}
//                   className="w-full p-2 focus:outline-none"
//                   required
//                 >
//                   <option value="">Select Gender</option>
//                   <option value="Male">Male</option>
//                   <option value="Female">Female</option>
//                   <option value="Other">Other</option>
//                 </select>
//               </div>
//             </div>

//             {/* Phone Number */}
//             <div>
//               <label className="block text-teal-700">Phone Number</label>
//               <div className="flex items-center border border-teal-300 rounded focus-within:ring-2 focus-within:ring-teal-400">
//                 <FaPhone className="ml-3" />
//                 <input
//                   type="text"
//                   name="phone_no"
//                   value={formData.phone_no}
//                   onChange={handleChange}
//                   className="w-full p-2 focus:outline-none"
//                   required
//                   maxLength={10}
//                 />
//               </div>
//             </div>

//             {/* Past History */}
//             <div>
//               <label className="block text-teal-700">Past History</label>
//               <div className="flex items-start border border-teal-300 rounded focus-within:ring-2 focus-within:ring-teal-400">
//                 <FaHistory className="ml-3" />
//                 <textarea
//                   name="past_history"
//                   value={formData.past_history}
//                   onChange={handleChange}
//                   className="w-full p-2 focus:outline-none"
//                   required
//                 ></textarea>
//               </div>
//             </div>

//             {/* Current Status */}
//             <div>
//               <label className="block text-teal-700">Current Status</label>
//               <div className="flex items-start border border-teal-300 rounded focus-within:ring-2 focus-within:ring-teal-400">
//                 <FaHeartbeat className="ml-3"/>
//                 <textarea
//                   name="current_status"
//                   value={formData.current_status}
//                   onChange={handleChange}
//                   className="w-full p-2 focus:outline-none"
//                   required
//                 ></textarea>
//               </div>
//             </div>

//             {/* Address */}
//             <div>
//               <label className="block text-teal-700">Address</label>
//               <div className="flex items-start border border-teal-300 rounded focus-within:ring-2 focus-within:ring-teal-400">
//                 <FaMapMarkedAlt className="ml-3" />
//                 <textarea
//                   name="address"
//                   value={formData.address}
//                   onChange={handleChange}
//                   className="w-full p-2 focus:outline-none"
//                   required
//                 ></textarea>
//               </div>
//             </div>

//             {/* Dentist ID */}
//             <div>
//               <label className="block text-teal-700">Dentist ID</label>
//               <div className="flex items-center border border-teal-300 rounded focus-within:ring-2 focus-within:ring-teal-400">
//                 <FaTooth className="ml-3" />
//                 <input
//                   type="text"
//                   name="dentistId"
//                   value={formData.dentistId}
//                   onChange={handleChange}
//                   className="w-full p-2 focus:outline-none"
//                   required
//                 />
//               </div>
//             </div>

//             <button
//               type="submit"
//               className="w-full bg-teal-600 text-white py-2 rounded-md transition"
//             >
//               Save Profile
//             </button>
//           </form>
//         </div>
//       </div>
//     </>
//   );
// };

// export default PatientProfile;











import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaUser, FaCalendar, FaVenusMars, FaPhone, FaHistory, FaHeartbeat, FaMapMarkedAlt, FaTooth } from "react-icons/fa";
import ReceptionNavbar from './ReceptionNavbar';

const PatientProfile = () => {
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    age: '',
    gender: '',
    phone_no: '',
    past_history: '',
    current_status: '',
    address: '',
    dentistId: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3000/api/patient/create', formData);
      if (response.data && response.data.message === "Patient data saved successfully") {
        toast.success('Patient profile created successfully!');
        setFormData({
          name: '',
          dob: '',
          age: '',
          gender: '',
          phone_no: '',
          past_history: '',
          current_status: '',
          address: '',
          dentistId: '',
        });
      }
    } catch (error) {
      toast.error(`Failed to create patient profile: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <>
      <ReceptionNavbar />
      <div className="flex justify-center items-center min-h-screen bg-white-100 ">
        <div className="w-full max-w-4xl mx-5 p-8 bg-white border border-gray-300 shadow-md hover:shadow-xl transition-shadow duration-300">
          <h1 className="text-2xl font-bold text-center text-green-500">Create Patient Profile</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div className="flex items-center" style={{ gap: '5px' }}>
              <FaUser className="text-teal-700" />
              <label className="block text-teal-700">Name</label>
            </div>
            <div className="flex items-center border border-teal-300 rounded focus-within:ring-2 focus-within:ring-teal-400">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 focus:outline-none"
                required
              />
            </div>

            {/* Date of Birth */}
            <div className="flex items-center" style={{ gap: '5px' }}>
              <FaCalendar className="text-teal-700" />
              <label className="block text-teal-700">Date of Birth</label>
            </div>
            <div className="flex items-center border border-teal-300 rounded focus-within:ring-2 focus-within:ring-teal-400">
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className="w-full p-2 focus:outline-none"
                required
              />
            </div>

            {/* Gender */}
            <div className="flex items-center" style={{ gap: '5px' }}>
              <FaVenusMars className="text-teal-700" />
              <label className="block text-teal-700">Gender</label>
            </div>
            <div className="flex items-center border border-teal-300 rounded focus-within:ring-2 focus-within:ring-teal-400">
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full p-2 focus:outline-none"
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Phone Number */}
            <div className="flex items-center" style={{ gap: '5px' }}>
              <FaPhone className="text-teal-700" />
              <label className="block text-teal-700">Phone Number</label>
            </div>
            <div className="flex items-center border border-teal-300 rounded focus-within:ring-2 focus-within:ring-teal-400">
              <input
                type="text"
                name="phone_no"
                value={formData.phone_no}
                onChange={handleChange}
                className="w-full p-2 focus:outline-none"
                required
                maxLength={10}
              />
            </div>

            {/* Past History */}
            <div className="flex items-center" style={{ gap: '5px' }}>
              <FaHistory className="text-teal-700" />
              <label className="block text-teal-700">Past History</label>
            </div>
            <div className="flex items-start border border-teal-300 rounded focus-within:ring-2 focus-within:ring-teal-400">
              <textarea
                name="past_history"
                value={formData.past_history}
                onChange={handleChange}
                className="w-full p-2 focus:outline-none"
                required
              ></textarea>
            </div>

            {/* Current Status */}
            <div className="flex items-center" style={{ gap: '5px' }}>
              <FaHeartbeat className="text-teal-700" />
              <label className="block text-teal-700">Current Status</label>
            </div>
            <div className="flex items-start border border-teal-300 rounded focus-within:ring-2 focus-within:ring-teal-400">
              <textarea
                name="current_status"
                value={formData.current_status}
                onChange={handleChange}
                className="w-full p-2 focus:outline-none"
                required
              ></textarea>
            </div>

            {/* Address */}
            <div className="flex items-center" style={{ gap: '5px' }}>
              <FaMapMarkedAlt className="text-teal-700" />
              <label className="block text-teal-700">Address</label>
            </div>
            <div className="flex items-start border border-teal-300 rounded focus-within:ring-2 focus-within:ring-teal-400">
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full p-2 focus:outline-none"
                required
              ></textarea>
            </div>

            {/* Dentist ID */}
            <div className="flex items-center" style={{ gap: '5px' }}>
              <FaTooth className="text-teal-700" />
              <label className="block text-teal-700">Dentist ID</label>
            </div>
            <div className="flex items-center border border-teal-300 rounded focus-within:ring-2 focus-within:ring-teal-400">
              <input
                type="text"
                name="dentistId"
                value={formData.dentistId}
                onChange={handleChange}
                className="w-full p-2 focus:outline-none"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded-md transition"
            >
              Save Profile
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default PatientProfile;
