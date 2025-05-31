// src/components/Login.jsx
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaTooth } from "react-icons/fa";
import Swal from "sweetalert2";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}users/login`,
        { email, password }
      );
      const user = response.data.user;
      const token = response.data.token;
      localStorage.setItem("token", JSON.stringify(token));
      login(user);

      Swal.fire({
        title: "Success!",
        text: "You have logged in successfully.",
        icon: "success",
        position: "top-end",
        showConfirmButton: false,
        timer: 1300,
        toast: true,
        customClass: {
          popup: "rounded-lg p-2",
          title: "text-sm",
          content: "text-xs",
        },
        width: "300px",
      });
    } catch (error) {
      Swal.fire({
        title: "Login Failed",
        text: "Invalid email or password. Please try again.",
        icon: "error",
        position: "top-end",
        showConfirmButton: false,
        timer: 2500,
        toast: true,
        customClass: {
          popup: "rounded-lg p-2",
          title: "text-sm",
          content: "text-xs",
        },
        width: "300px",
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-teal-100 px-4">
      {/* Container with left banner + form */}
      <div className="flex w-full max-w-4xl shadow-2xl rounded-2xl overflow-hidden bg-white">
        {/* Left Banner */}
        <div className="hidden md:flex flex-col justify-center bg-gradient-to-br from-teal-700 to-teal-900 text-white p-10 w-1/2">
          <FaTooth className="text-6xl mb-4" />
          <h2 className="text-5xl font-extrabold mb-3">Smile Dental Clinic</h2>
          <p className="text-lg leading-relaxed max-w-xs">
            Your Trusted Partner for a Healthy & Beautiful Smile.
          </p>
        </div>

        {/* Right Login Form */}
        <div className="w-full md:w-1/2 p-8">
          <div className="flex flex-col items-center mb-6 md:hidden">
            <FaTooth className="text-5xl text-teal-500 mb-2" />
            <h2 className="text-3xl font-extrabold text-teal-700">
              Smile & Login
            </h2>
            <p className="text-sm text-gray-500">
              Unlock Your Brightest Smile!
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="text-sm text-gray-700 font-semibold">
                Email
              </label>
              <div className="flex items-center border border-gray-300 rounded-xl px-3 mt-1 bg-gray-50 focus-within:ring-2 focus-within:ring-teal-400">
                <FaEnvelope className="text-teal-400" />
                <input
                  type="email"
                  value={email}
                  placeholder="Enter your email"
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 bg-transparent focus:outline-none text-gray-700 placeholder-gray-400"
                  required
                />
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-700 font-semibold">
                Password
              </label>
              <div className="flex items-center border border-gray-300 rounded-xl px-3 mt-1 bg-gray-50 focus-within:ring-2 focus-within:ring-teal-400">
                <FaLock className="text-teal-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  placeholder="Enter your password"
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 bg-transparent focus:outline-none text-gray-700 placeholder-gray-400"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="ml-2 text-teal-500 focus:outline-none"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-teal-500 text-white font-semibold rounded-xl hover:bg-teal-600 transition duration-300 shadow-md"
            >
              Login
            </button>
          </form>

          <div className="mt-5 text-center text-sm">
            <button
              onClick={() => navigate("/forgot-password")}
              className="text-teal-600 hover:underline"
            >
              Forgot Password?
            </button>
            <p className="mt-2 text-gray-600">
              Don’t have an account?{" "}
              <button
                onClick={() => navigate("/register")}
                className="text-teal-600 hover:underline"
              >
                Register here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
