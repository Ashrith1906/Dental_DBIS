import { useState } from "react";
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
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}patient`,
        {
          ...formData,
          age,
        }
      );

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
