// // src/components/Login.jsx
// import React, { useState } from "react";
// import { useAuth } from "../contexts/AuthContext";
// import { useNavigate } from "react-router-dom"; // Import useNavigate
// import axios from "axios";
// import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa"; // Importing icons
// import Swal from "sweetalert2"; // Import SweetAlert2
// import { Link } from "react-router-dom";

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const { login } = useAuth();
//   const navigate = useNavigate(); // Initialize useNavigate
//   const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post(
//         "http://localhost:3000/api/users/login",
//         {
//           email,
//           password,
//         }
//       );
//       const user = response.data.user;
//       const token = response.data.token;
//       console.log(token);
//       console.log(user);
//       localStorage.setItem("token", JSON.stringify(token)); // Store token
//       login(user); // Use context to handle login and redirection

//       // Show success alert with custom styling and auto-close
//       Swal.fire({
//         title: "Success!",
//         text: "You have logged in successfully.",
//         icon: "success",
//         position: "top-end", // Position the alert at the top right
//         showConfirmButton: false, // Hide the confirm button
//         timer: 1300, // Auto-close after 1.3 seconds
//         toast: true, // Display as a toast notification
//         customClass: {
//           popup: "rounded-lg p-2", // Rounded corners and padding for compactness
//           title: "text-sm", // Smaller title font
//           content: "text-xs", // Smaller content font
//         },
//         width: "300px", // Set a fixed width for a smaller rectangular shape
//       });
//     } catch (error) {
//       console.error("Login failed:", error.response?.data || error.message);

//       // Show error alert with custom styling and auto-close
//       Swal.fire({
//         title: "Login Failed",
//         text: "Invalid email or password. Please try again.",
//         icon: "error",
//         position: "top-end", // Position the alert at the top right
//         showConfirmButton: false, // Hide the confirm button
//         timer: 2500, // Auto-close after 2.5 seconds
//         toast: true, // Display as a toast notification
//         customClass: {
//           popup: "rounded-lg p-2", // Rounded corners and padding for compactness
//           title: "text-sm", // Smaller title font
//           content: "text-xs", // Smaller content font
//         },
//         width: "300px", // Set a fixed width for a smaller rectangular shape
//       });
//     }
//   };
//   return (
//     <div className="flex items-center justify-center min-h-screen bg-teal-50">
//       <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
//         <h2 className="text-2xl font-bold mb-6 text-center text-teal-800">
//           Login
//         </h2>
//         <form onSubmit={handleLogin} className="space-y-4">
//           <div>
//             <label className="text-teal-900 font-semibold">Email</label>
//             <div className="flex items-center border border-teal-300 rounded-lg focus-within:ring focus-within:ring-teal-500">
//               <FaEnvelope className="ml-3 text-teal-500" />
//               <input
//                 type="text"
//                 placeholder="Email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="w-full p-3 focus:outline-none focus:bg-teal-50 placeholder-teal-400"
//                 required
//               />
//             </div>
//           </div>
//           <div>
//             <label className="text-teal-900 font-semibold">Password</label>
//             <div className="flex items-center border border-teal-300 rounded-lg focus-within:ring focus-within:ring-teal-500">
//               <FaLock className="ml-3 text-teal-500" />
//               <input
//                 type={showPassword ? "text" : "password"}
//                 placeholder="Password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="w-full p-3 focus:outline-none focus:bg-teal-50 placeholder-teal-400"
//                 required
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword((prev) => !prev)}
//                 className="mr-3 focus:outline-none text-teal-500"
//               >
//                 {showPassword ? <FaEyeSlash /> : <FaEye />}
//               </button>
//             </div>
//           </div>
//           <button
//             type="submit"
//             className="w-full py-3 bg-teal-600 text-white font-semibold rounded-lg shadow-lg hover:bg-teal-700 focus:outline-none focus:ring focus:ring-teal-500"
//           >
//             Login
//           </button>
//         </form>
//         <div className="mt-4 text-center">
//           <button
//             onClick={() => navigate("/forgot-password")}
//             className="text-teal-600 hover:underline"
//           >
//             Forgot Password?
//           </button>
//           <div className="mt-2">
//             <span className="text-black-700">Don't have an account? </span>
//             <button
//               onClick={() => navigate("/register")}
//               className="text-teal-600 hover:underline"
//             >
//               Register here
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
  
// };

// export default Login;


// src/components/Login.jsx
import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaTooth } from "react-icons/fa";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

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
        "http://localhost:3000/api/users/login",
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
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl">
        <div className="flex flex-col items-center mb-6">
          <FaTooth className="text-4xl text-teal-500 mb-2" />
          <h2 className="text-3xl font-extrabold text-teal-700">Smile & Login</h2>
          <p className="text-sm text-gray-500">Unlock Your Brightest Smile!</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="text-sm text-gray-700 font-semibold">Email</label>
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
            <label className="text-sm text-gray-700 font-semibold">Password</label>
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
  );
};

export default Login;