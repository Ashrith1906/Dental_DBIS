import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import ReceptionNavbar from './ReceptionNavbar'

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
    <ReceptionNavbar/>
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center">Create Patient Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">Age</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700">Phone Number</label>
            <input
              type="text"
              name="phone_no"
              value={formData.phone_no}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
              maxLength={10}
            />
          </div>

          <div>
            <label className="block text-gray-700">Past History</label>
            <textarea
              name="past_history"
              value={formData.past_history}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            ></textarea>
          </div>

          <div>
            <label className="block text-gray-700">Current Status</label>
            <textarea
              name="current_status"
              value={formData.current_status}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            ></textarea>
          </div>

          <div>
            <label className="block text-gray-700">Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            ></textarea>
          </div>

          <div>
            <label className="block text-gray-700">Dentist ID</label>
            <input
              type="text"
              name="dentistId"
              value={formData.dentistId}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
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