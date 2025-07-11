// import { useState, useEffect } from "react";
// import axios from "axios";
// import toast from "react-hot-toast";
// import { useAuth } from "../contexts/AuthContext";
// import Navbar from "./PatientNavbar";

// const PatientProfile = () => {
//   const { patientId } = useAuth();
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
//           `${import.meta.env.VITE_API_BASE_URL}patient/${patientId}`
//         );
//         if (response.data && response.data.patient) {
//           const patient = response.data.patient;
//           setFormData({
//             name: patient.name || "",
//             dob: patient.dob ? patient.dob.split("T")[0] : "",
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
//         if (error.response?.status === 404) {
//           // Profile not found - normal case for new patients, no error toast
//           setIsUpdating(false);
//         } else {
//           console.error(
//             "Error fetching patient profile:",
//             error.response?.data || error.message
//           );
//           toast.error(
//             `Failed to fetch patient profile: ${
//               error.response?.data?.message || error.message
//             }`
//           );
//         }
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
//     const age = calculateAge(formData.dob);

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
//         response = await axios.put(
//           `${import.meta.env.VITE_API_BASE_URL}patient/${patientId}`,
//           {
//             ...formData,
//             age,
//           }
//         );
//       } else {
//         response = await axios.post(
//           `${import.meta.env.VITE_API_BASE_URL}patient`,
//           {
//             ...formData,
//             age,
//             pID: patientId,
//           }
//         );
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
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-100">
//       <Navbar />
//       <div className="flex justify-center items-center py-12 px-4">
//         <div className="w-full max-w-2xl p-8 bg-white border border-gray-200 rounded-2xl shadow-2xl">
//           <h2 className="text-3xl font-extrabold text-center text-teal-700 mb-6">
//             {isUpdating ? "Update" : "Create"} Your Profile
//           </h2>

//           <form onSubmit={handleSubmit} className="space-y-5">
//             {/* Name */}
//             <div>
//               <label className="block text-sm font-medium text-teal-900 mb-1">
//                 Name *
//               </label>
//               <input
//                 type="text"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 className="w-full p-3 rounded-xl border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-400"
//               />
//             </div>

//             {/* DOB */}
//             <div>
//               <label className="block text-sm font-medium text-teal-900 mb-1">
//                 Date of Birth *
//               </label>
//               <input
//                 type="date"
//                 name="dob"
//                 value={formData.dob}
//                 onChange={handleChange}
//                 className="w-full p-3 rounded-xl border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-400"
//               />
//             </div>

//             {/* Gender */}
//             <div>
//               <label className="block text-sm font-medium text-teal-900 mb-1">
//                 Gender *
//               </label>
//               <select
//                 name="gender"
//                 value={formData.gender}
//                 onChange={handleChange}
//                 className="w-full p-3 rounded-xl border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-400"
//               >
//                 <option value="">Select Gender</option>
//                 <option value="Male">Male</option>
//                 <option value="Female">Female</option>
//                 <option value="Other">Other</option>
//               </select>
//             </div>

//             {/* Phone Number */}
//             <div>
//               <label className="block text-sm font-medium text-teal-900 mb-1">
//                 Phone Number *
//               </label>
// <input
//   type="text"
//   name="phone_no"
//   value={formData.phone_no}
//   onChange={handleChange}
//   maxLength={10}
//   className="w-full p-3 rounded-xl border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-400"
// />
//             </div>

//             {/* Past History */}
//             <div>
//               <label className="block text-sm font-medium text-teal-900 mb-1">
//                 Past History *
//               </label>
//               <textarea
//                 name="past_history"
//                 value={formData.past_history}
//                 onChange={handleChange}
//                 rows={3}
//                 className="w-full p-3 rounded-xl border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-400"
//               />
//             </div>

//             {/* Current Status */}
//             <div>
//               <label className="block text-sm font-medium text-teal-900 mb-1">
//                 Current Status *
//               </label>
//               <textarea
//                 name="current_status"
//                 value={formData.current_status}
//                 onChange={handleChange}
//                 rows={3}
//                 className="w-full p-3 rounded-xl border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-400"
//               />
//             </div>

//             {/* Address */}
//             <div>
//               <label className="block text-sm font-medium text-teal-900 mb-1">
//                 Address *
//               </label>
//               <textarea
//                 name="address"
//                 value={formData.address}
//                 onChange={handleChange}
//                 rows={3}
//                 className="w-full p-3 rounded-xl border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-400"
//               />
//             </div>

//             <div className="pt-4">
//               <button
//                 type="submit"
//                 className="w-full py-3 bg-teal-500 hover:bg-teal-600 text-white text-base font-semibold rounded-xl shadow-md transition"
//               >
//                 {isUpdating ? "Update Profile" : "Save Profile"}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PatientProfile;

import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "./PatientNavbar";
import { Loader2 } from "lucide-react";
import Footer from "../Footer";

const PatientProfile = () => {
  const { patientId } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    gender: "",
    phone_no: "",
    past_history: "",
    current_status: "",
    address: "",
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

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

  useEffect(() => {
    const fetchPatient = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}patient/${patientId}`
        );
        if (response.data?.patient) {
          const patient = response.data.patient;
          setFormData({
            name: patient.name || "",
            dob: patient.dob ? patient.dob.split("T")[0] : "",
            gender: patient.gender || "",
            phone_no: patient.phone_no || "",
            past_history: patient.past_history || "",
            current_status: patient.current_status || "",
            address: patient.address || "",
          });
          setIsUpdating(true);
        } else {
          setIsUpdating(false);
        }
      } catch (error) {
        if (error.response?.status !== 404) {
          toast.error(
            `Failed to fetch profile: ${
              error.response?.data?.message || error.message
            }`
          );
        }
      } finally {
        setLoading(false);
      }
    };

    if (patientId) fetchPatient();
  }, [patientId]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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

    if (!/^[0-9]{10}$/.test(formData.phone_no)) {
      toast.error("Phone number must be a 10-digit number");
      return;
    }

    try {
      setSubmitting(true);
      let response;

      if (isUpdating) {
        response = await axios.put(
          `${import.meta.env.VITE_API_BASE_URL}patient/${patientId}`,
          { ...formData, age }
        );
      } else {
        response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}patient`,
          { ...formData, age, pID: patientId }
        );
      }

      if (response.data?.message) {
        toast.success(response.data.message);
        setIsUpdating(true);
      }
    } catch (error) {
      toast.error(
        `Failed to ${isUpdating ? "update" : "create"} profile: ${
          error.response?.data?.message || error.message
        }`
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-teal-100">
      <Navbar />
      {/* Main Content */}
      <div className="flex-grow w-full max-w-3xl mx-auto px-6 py-4">
        <div className="w-full max-w-2xl p-8 bg-white border border-gray-200 rounded-2xl shadow-2xl">
          <h2 className="text-3xl font-extrabold text-center text-teal-700 mb-6">
            {isUpdating ? "Update" : "Create"} Your Profile
          </h2>

          {loading ? (
            <div className="flex justify-center text-teal-600 py-10">
              <Loader2 className="animate-spin w-6 h-6" />
              <span className="ml-2 text-lg font-medium">
                Loading profile...
              </span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Input Fields */}
              {[
                { label: "Name", name: "name", type: "text" },
                { label: "Date of Birth", name: "dob", type: "date" },
              ].map(({ label, name, type }) => (
                <div key={name}>
                  <label className="block text-sm font-medium text-teal-900 mb-1">
                    {label} *
                  </label>
                  <input
                    type={type}
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    className="w-full p-3 rounded-xl border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-400"
                  />
                </div>
              ))}

              {/* Phone Number - Special Handling */}
              <div>
                <label className="block text-sm font-medium text-teal-900 mb-1">
                  Phone Number *
                </label>
                <input
                  type="text"
                  name="phone_no"
                  value={formData.phone_no}
                  onChange={(e) => {
                    const digits = e.target.value.replace(/\D/g, "");
                    if (digits.length <= 10) {
                      setFormData((prev) => ({ ...prev, phone_no: digits }));
                    }
                  }}
                  inputMode="numeric"
                  maxLength={10}
                  className="w-full p-3 rounded-xl border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-400"
                  required
                />
              </div>

              {/* Gender Select */}
              <div>
                <label className="block text-sm font-medium text-teal-900 mb-1">
                  Gender *
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full p-3 rounded-xl border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-400"
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
                  <label className="block text-sm font-medium text-teal-900 mb-1">
                    {label} *
                  </label>
                  <textarea
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    rows={2}
                    className="w-full p-3 rounded-xl border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-400"
                  />
                </div>
              ))}

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 bg-teal-500 hover:bg-teal-600 text-white text-base font-semibold rounded-xl shadow-md transition disabled:opacity-60 flex items-center justify-center"
                >
                  {submitting && (
                    <Loader2 className="animate-spin h-5 w-5 mr-2 text-white" />
                  )}
                  {isUpdating ? "Update Profile" : "Save Profile"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PatientProfile;
