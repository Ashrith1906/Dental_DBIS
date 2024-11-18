// src/components/Login.jsx
import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa"; // Importing icons
import Swal from "sweetalert2"; // Import SweetAlert2
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate(); // Initialize useNavigate
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/api/users/login",
        {
          email,
          password,
        }
      );
      const user = response.data.user;
      const token = response.data.token;
      console.log(token);
      console.log(user);
      localStorage.setItem("token", JSON.stringify(token)); // Store token
      login(user); // Use context to handle login and redirection

      // Show success alert with custom styling and auto-close
      Swal.fire({
        title: "Success!",
        text: "You have logged in successfully.",
        icon: "success",
        position: "top-end", // Position the alert at the top right
        showConfirmButton: false, // Hide the confirm button
        timer: 1300, // Auto-close after 1.3 seconds
        toast: true, // Display as a toast notification
        customClass: {
          popup: "rounded-lg p-2", // Rounded corners and padding for compactness
          title: "text-sm", // Smaller title font
          content: "text-xs", // Smaller content font
        },
        width: "300px", // Set a fixed width for a smaller rectangular shape
      });
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);

      // Show error alert with custom styling and auto-close
      Swal.fire({
        title: "Login Failed",
        text: "Invalid email or password. Please try again.",
        icon: "error",
        position: "top-end", // Position the alert at the top right
        showConfirmButton: false, // Hide the confirm button
        timer: 2500, // Auto-close after 2.5 seconds
        toast: true, // Display as a toast notification
        customClass: {
          popup: "rounded-lg p-2", // Rounded corners and padding for compactness
          title: "text-sm", // Smaller title font
          content: "text-xs", // Smaller content font
        },
        width: "300px", // Set a fixed width for a smaller rectangular shape
      });
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-teal-50">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-teal-800">
          Login
        </h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-teal-900 font-semibold">Email</label>
            <div className="flex items-center border border-teal-300 rounded-lg focus-within:ring focus-within:ring-teal-500">
              <FaEnvelope className="ml-3 text-teal-500" />
              <input
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 focus:outline-none focus:bg-teal-50 placeholder-teal-400"
                required
              />
            </div>
          </div>
          <div>
            <label className="text-teal-900 font-semibold">Password</label>
            <div className="flex items-center border border-teal-300 rounded-lg focus-within:ring focus-within:ring-teal-500">
              <FaLock className="ml-3 text-teal-500" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 focus:outline-none focus:bg-teal-50 placeholder-teal-400"
                required
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
          <button
            type="submit"
            className="w-full py-3 bg-teal-600 text-white font-semibold rounded-lg shadow-lg hover:bg-teal-700 focus:outline-none focus:ring focus:ring-teal-500"
          >
            Login
          </button>
        </form>
        <div className="mt-4 text-center">
          <button
            onClick={() => navigate("/forgot-password")}
            className="text-teal-600 hover:underline"
          >
            Forgot Password?
          </button>
          <div className="mt-2">
            <span className="text-black-700">Don't have an account? </span>
            <button
              onClick={() => navigate("/register")}
              className="text-teal-600 hover:underline"
            >
              Register here
            </button>
          </div>
        </div>
      </div>
    </div>
  );
  
};

export default Login;
