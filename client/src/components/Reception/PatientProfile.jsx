import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaUser, FaCalendar, FaVenusMars, FaPhone, FaHistory, FaHeartbeat, FaMapMarkedAlt, FaTooth } from "react-icons/fa";
import ReceptionNavbar from './ReceptionNavbar';

// Function to calculate age from date of birth
const calculateAge = (dob) => {
  const today = new Date();
  const birthDate = new Date(dob);
  let age = today.getFullYear() - birthDate.getFullYear();
  const month = today.getMonth();
  if (month < birthDate.getMonth() || (month === birthDate.getMonth() && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

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

  const [dentists, setDentists] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDentists = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:3000/api/profiles/getAllDentists');
        console.log("Dentists:", response.data.dentists);  // Add this line to check if dentists are being fetched properly
        setDentists(response.data.dentists); // Set the dentists state with the response
      } catch (error) {
        console.error("Error fetching dentists:", error);
        toast.error('Failed to fetch dentist profiles');
      } finally {
        setLoading(false);
      }
    };
  
    fetchDentists();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Client-side validation
    if (formData.phone_no.length !== 10) {
      toast.error('Phone number must be 10 digits');
      return;
    }

    // Validate date of birth
    const dob = new Date(formData.dob);
    if (dob > new Date()) {
      toast.error('Date of birth cannot be in the future');
      return;
    }

    // Calculate age from dob
    const age = calculateAge(formData.dob);

    // Prepare form data with calculated age
    const dataToSubmit = {
      ...formData,
      age, // Dynamically calculated age
    };

    console.log("Form Data to Submit:", dataToSubmit); // Debugging output

    try {
      const response = await axios.post('http://localhost:3000/api/patient/create', dataToSubmit);
      console.log("Response from Server:", response.data); // Debugging output
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
      console.log("Error Response:", error.response?.data); // Debugging output
      toast.error(`Failed to create patient profile: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <>
      <ReceptionNavbar />
      <div className="flex justify-center items-center min-h-screen bg-white-100 px-5">
      <div className="w-full p-4 px-[30px] mb-6 border border-gray-300 rounded-md shadow-md hover:shadow-xl transition-shadow duration-300 mx-5 my-3.5 ">
      <h1 className="text-3xl font-bold text-center text-teal-600">Create Patient Profile</h1>
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

            {/* Dentist ID Dropdown */}
            <div className="flex items-center" style={{ gap: '5px' }}>
              <FaTooth className="text-teal-700" />
              <label className="block text-teal-700">Dentist</label>
            </div>
            <div className="flex items-center border border-teal-300 rounded focus-within:ring-2 focus-within:ring-teal-400">
              <select
                name="dentistId"
                value={formData.dentistId}
                onChange={handleChange}
                className="w-full p-2 focus:outline-none"
                required
              >
                <option value="">Select Dentist</option>
                {dentists.map((dentist) => (
                  <option key={dentist._id} value={dentist.dentistId}>
                    {dentist.name} ({dentist.specialization})
                  </option>
                ))}
              </select>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
              type="submit"
              className=" py-3 px-10 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition font-bold"
            >
              {loading ? "Creating..." : "Save Profile"}
            </button>
            </div>
            
          </form>
        </div>
      </div>
    </>
  );
};

export default PatientProfile;