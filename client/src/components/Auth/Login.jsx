import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaTooth } from "react-icons/fa";
import toast from "react-hot-toast";
import Footer from "../Footer";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}users/login`,
        { email, password }
      );
      const user = response.data.user;
      const token = response.data.token;
      localStorage.setItem("token", JSON.stringify(token));
      login(user);

      toast.success("You have logged in successfully.", {
        position: "top-right",
        duration: 1300,
      });
    } catch (error) {
      toast.error("Invalid email or password. Please try again.", {
        position: "top-right",
        duration: 2500,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-teal-100">
      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center mb-2 px-4">
        <div className="flex w-full max-w-4xl shadow-2xl rounded-2xl overflow-hidden bg-white">
          {/* Left Panel */}
          <div className="hidden md:flex flex-col justify-center bg-gradient-to-br from-teal-700 to-teal-900 text-white p-10 w-1/2">
            <FaTooth className="text-6xl mb-4" />
            <h2 className="text-5xl font-extrabold mb-3">Smile Dental Clinic</h2>
            <p className="text-lg leading-relaxed max-w-xs">
              Your Trusted Partner for a Healthy & Beautiful Smile.
            </p>
          </div>

          {/* Right Panel - Form */}
          <div className="w-full md:w-1/2 p-8">
            {/* Logo for mobile */}
            <div className="flex flex-col items-center mb-6 md:hidden">
              <FaTooth className="text-5xl text-teal-500 mb-2" />
              <h2 className="text-3xl font-extrabold text-teal-700">
                Smile & Login
              </h2>
              <p className="text-sm text-gray-500">Unlock Your Brightest Smile!</p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="text-sm text-gray-700 font-semibold">Email</label>
                <div className="flex items-center border border-gray-300 rounded-xl px-3 mt-1 bg-gray-50 focus-within:ring-2 focus-within:ring-teal-400">
                  <FaEnvelope className="text-teal-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full p-3 bg-transparent focus:outline-none text-gray-700 placeholder-gray-400"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-700 font-semibold">Password</label>
                <div className="flex items-center border border-gray-300 rounded-xl px-3 mt-1 bg-gray-50 focus-within:ring-2 focus-within:ring-teal-400">
                  <FaLock className="text-teal-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full p-3 bg-transparent focus:outline-none text-gray-700 placeholder-gray-400"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="ml-2 text-teal-500 focus:outline-none"
                    disabled={loading}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 bg-teal-500 text-white font-semibold rounded-xl hover:bg-teal-600 transition duration-300 shadow-md flex justify-center items-center ${
                  loading ? "cursor-not-allowed opacity-70" : ""
                }`}
              >
                {loading ? (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                  </svg>
                ) : (
                  "Login"
                )}
              </button>
            </form>

            {/* Links */}
            <div className="mt-5 text-center text-sm">
              <button
                onClick={() => navigate("/login")}
                className="text-teal-600 hover:underline"
                disabled={loading}
              >
                Forgot Password?
              </button>
              <p className="mt-2 text-gray-600">
                Don’t have an account?{" "}
                <button
                  onClick={() => navigate("/register")}
                  className="text-teal-600 hover:underline"
                  disabled={loading}
                >
                  Register here
                </button>
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer stays at bottom */}
      <Footer />
    </div>
  );
};

export default Login;