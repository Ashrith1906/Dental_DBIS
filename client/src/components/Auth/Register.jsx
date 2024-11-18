import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaUserShield,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import Swal from "sweetalert2";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  // const [dentistId, setDentistId] = useState("");
  // const [receptionistId, setReceptionistId] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (password !== confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Passwords do not match!",
        timer: 2500,
        showConfirmButton: false,
        toast: true,
        position: "top-end",
      });
      return;
    }

    try {
      // Dynamically add dentistId or receptionistId based on the role
      const payload = {
        email,
        password,
        confirm_password: confirmPassword,
        role,
      };

      const response = await axios.post(
        "http://localhost:3000/api/users/register",
        payload
      );

      Swal.fire({
        icon: "success",
        title: "Registration Successful",
        text: "You can now log in!",
        timer: 1500,
        showConfirmButton: false,
        toast: true,
        position: "top-end",
      });

      navigate("/login");
    } catch (error) {
      console.error("Error registering user", error.response?.data);

      // Check if the error is due to username or email already existing
      if (error.response?.data?.username) {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "A User with the same username already exists.",
          timer: 2500,
          showConfirmButton: false,
          toast: true,
          position: "top-end",
        });
      } else if (error.response?.data?.email) {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "A User with the same Email already exists.",
          timer: 2500,
          showConfirmButton: false,
          toast: true,
          position: "top-end",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text:
            error.response?.data?.detail ||
            "Registration failed. Please try again.",
          timer: 2500,
          showConfirmButton: false,
          toast: true,
          position: "top-end",
        });
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-teal-50">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-teal-800">
          Register
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-teal-900 font-semibold">Email</label>
            <div className="flex items-center border border-teal-300 rounded-lg focus-within:ring focus-within:ring-teal-500">
              <FaEnvelope className="ml-3 text-teal-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                autoComplete="email"
                className="w-full p-3 focus:outline-none focus:bg-teal-50 placeholder-teal-400"
              />
            </div>
          </div>
          <div>
            <label className="text-teal-900 font-semibold">Password</label>
            <div className="flex items-center border border-teal-300 rounded-lg focus-within:ring focus-within:ring-teal-500">
              <FaLock className="ml-3 text-teal-500" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                autoComplete="new-password"
                className="w-full p-3 focus:outline-none focus:bg-teal-50 placeholder-teal-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="mr-3 focus:outline-none text-teal-500"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          <div>
            <label className="text-teal-900 font-semibold">Confirm Password</label>
            <div className="flex items-center border border-teal-300 rounded-lg focus-within:ring focus-within:ring-teal-500">
              <FaLock className="ml-3 text-teal-500" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                autoComplete="new-password"
                className="w-full p-3 focus:outline-none focus:bg-teal-50 placeholder-teal-400"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="mr-3 focus:outline-none text-teal-500"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          <div>
            <label className="text-teal-900 font-semibold">Role</label>
            <div className="flex items-center border border-teal-300 rounded-lg focus-within:ring focus-within:ring-teal-500">
              <FaUserShield className="ml-3 text-teal-500" />
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
                className="w-full p-3 focus:outline-none bg-teal-50 text-teal-800 placeholder-teal-400"
              >
                <option value="">Select Role</option>
                <option value="Dentist">Dentist</option>
                <option value="Receptionist">Receptionist</option>
              </select>
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-teal-600 text-white font-semibold rounded-lg shadow-lg hover:bg-teal-700 focus:outline-none focus:ring focus:ring-teal-500"
          >
            Register
          </button>
        </form>
        <div className="mt-4 text-center">
          <span className="text-black-700">Already have an account? </span>
          <button
            onClick={() => navigate("/login")}
            className="text-teal-600 hover:underline"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
  
};

export default Register;