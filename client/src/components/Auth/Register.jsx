// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import {
//   FaUser,
//   FaEnvelope,
//   FaLock,
//   FaUserShield,
//   FaEye,
//   FaEyeSlash,
// } from "react-icons/fa";
// import Swal from "sweetalert2";

// const Register = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [role, setRole] = useState("");
//   // const [dentistId, setDentistId] = useState("");
//   // const [receptionistId, setReceptionistId] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Check if passwords match
//     if (password !== confirmPassword) {
//       Swal.fire({
//         icon: "error",
//         title: "Oops...",
//         text: "Passwords do not match!",
//         timer: 2500,
//         showConfirmButton: false,
//         toast: true,
//         position: "top-end",
//       });
//       return;
//     }

//     try {
//       // Dynamically add dentistId or receptionistId based on the role
//       const payload = {
//         email,
//         password,
//         confirm_password: confirmPassword,
//         role,
//       };

//       const response = await axios.post(
//         "http://localhost:3000/api/users/register",
//         payload
//       );

//       Swal.fire({
//         icon: "success",
//         title: "Registration Successful",
//         text: "You can now log in!",
//         timer: 1500,
//         showConfirmButton: false,
//         toast: true,
//         position: "top-end",
//       });

//       navigate("/login");
//     } catch (error) {
//       console.error("Error registering user", error.response?.data);

//       // Check if the error is due to username or email already existing
//       if (error.response?.data?.username) {
//         Swal.fire({
//           icon: "error",
//           title: "Error!",
//           text: "A User with the same username already exists.",
//           timer: 2500,
//           showConfirmButton: false,
//           toast: true,
//           position: "top-end",
//         });
//       } else if (error.response?.data?.email) {
//         Swal.fire({
//           icon: "error",
//           title: "Error!",
//           text: "A User with the same Email already exists.",
//           timer: 2500,
//           showConfirmButton: false,
//           toast: true,
//           position: "top-end",
//         });
//       } else {
//         Swal.fire({
//           icon: "error",
//           title: "Error!",
//           text:
//             error.response?.data?.detail ||
//             "Registration failed. Please try again.",
//           timer: 2500,
//           showConfirmButton: false,
//           toast: true,
//           position: "top-end",
//         });
//       }
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-teal-50">
//       <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
//         <h2 className="text-2xl font-bold mb-6 text-center text-teal-800">
//           Register
//         </h2>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="text-teal-900 font-semibold">Email</label>
//             <div className="flex items-center border border-teal-300 rounded-lg focus-within:ring focus-within:ring-teal-500">
//               <FaEnvelope className="ml-3 text-teal-500" />
//               <input
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 placeholder="Email"
//                 autoComplete="email"
//                 className="w-full p-3 focus:outline-none focus:bg-teal-50 placeholder-teal-400"
//               />
//             </div>
//           </div>
//           <div>
//             <label className="text-teal-900 font-semibold">Password</label>
//             <div className="flex items-center border border-teal-300 rounded-lg focus-within:ring focus-within:ring-teal-500">
//               <FaLock className="ml-3 text-teal-500" />
//               <input
//                 type={showPassword ? "text" : "password"}
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 placeholder="Password"
//                 autoComplete="new-password"
//                 className="w-full p-3 focus:outline-none focus:bg-teal-50 placeholder-teal-400"
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
//           <div>
//             <label className="text-teal-900 font-semibold">
//               Confirm Password
//             </label>
//             <div className="flex items-center border border-teal-300 rounded-lg focus-within:ring focus-within:ring-teal-500">
//               <FaLock className="ml-3 text-teal-500" />
//               <input
//                 type={showConfirmPassword ? "text" : "password"}
//                 value={confirmPassword}
//                 onChange={(e) => setConfirmPassword(e.target.value)}
//                 placeholder="Confirm Password"
//                 autoComplete="new-password"
//                 className="w-full p-3 focus:outline-none focus:bg-teal-50 placeholder-teal-400"
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowConfirmPassword((prev) => !prev)}
//                 className="mr-3 focus:outline-none text-teal-500"
//               >
//                 {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
//               </button>
//             </div>
//           </div>
//           <div>
//             <label className="text-teal-900 font-semibold">Role</label>
//             <div className="flex items-center border border-teal-300 rounded-lg focus-within:ring focus-within:ring-teal-500">
//               <FaUserShield className="ml-3 text-teal-500" />
//               <select
//                 value={role}
//                 onChange={(e) => setRole(e.target.value)}
//                 required
//                 className="w-full p-3 focus:outline-none bg-teal-50 text-teal-800 placeholder-teal-400"
//               >
//                 <option value="">Select Role</option>
//                 <option value="Dentist">Dentist</option>
//                 <option value="Receptionist">Receptionist</option>
//                 <option value="Patient">Patient</option> {/* Added */}
//               </select>
//             </div>
//           </div>
//           <button
//             type="submit"
//             className="w-full py-3 bg-teal-600 text-white font-semibold rounded-lg shadow-lg hover:bg-teal-700 focus:outline-none focus:ring focus:ring-teal-500"
//           >
//             Register
//           </button>
//         </form>
//         <div className="mt-4 text-center">
//           <span className="text-black-700">Already have an account? </span>
//           <button
//             onClick={() => navigate("/login")}
//             className="text-teal-600 hover:underline"
//           >
//             Login
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Register;

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

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
      const payload = {
        email,
        password,
        confirm_password: confirmPassword,
        role,
      };

      await axios.post("http://localhost:3000/api/users/register", payload);

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
      const message =
        error.response?.data?.email ||
        error.response?.data?.username ||
        error.response?.data?.detail ||
        "Registration failed. Please try again.";
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: message,
        timer: 2500,
        showConfirmButton: false,
        toast: true,
        position: "top-end",
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-teal-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl">
        <div className="flex flex-col items-center mb-6">
          <FaUserShield className="text-4xl text-teal-500 mb-2" />
          <h2 className="text-3xl font-extrabold text-teal-700">Create Account</h2>
          <p className="text-sm text-gray-500">Join us and smile brighter!</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
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
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-sm text-gray-700 font-semibold">Password</label>
            <div className="flex items-center border border-gray-300 rounded-xl px-3 mt-1 bg-gray-50 focus-within:ring-2 focus-within:ring-teal-400">
              <FaLock className="text-teal-400" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                placeholder="Create a password"
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 bg-transparent focus:outline-none text-gray-700 placeholder-gray-400"
                required
                autoComplete="new-password"
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

          {/* Confirm Password */}
          <div>
            <label className="text-sm text-gray-700 font-semibold">Confirm Password</label>
            <div className="flex items-center border border-gray-300 rounded-xl px-3 mt-1 bg-gray-50 focus-within:ring-2 focus-within:ring-teal-400">
              <FaLock className="text-teal-400" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                placeholder="Re-enter your password"
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-3 bg-transparent focus:outline-none text-gray-700 placeholder-gray-400"
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="ml-2 text-teal-500 focus:outline-none"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Role */}
          <div>
            <label className="text-sm text-gray-700 font-semibold">Role</label>
            <div className="flex items-center border border-gray-300 rounded-xl px-3 mt-1 bg-gray-50 focus-within:ring-2 focus-within:ring-teal-400">
              <FaUserShield className="text-teal-400" />
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
                className="w-full p-3 bg-transparent focus:outline-none text-gray-700 placeholder-gray-400"
              >
                <option value="">Select Role</option>
                <option value="Dentist">Dentist</option>
                <option value="Receptionist">Receptionist</option>
                <option value="Patient">Patient</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-teal-500 text-white font-semibold rounded-xl hover:bg-teal-600 transition duration-300 shadow-md"
          >
            Register
          </button>
        </form>

        <div className="mt-5 text-center text-sm text-gray-700">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-teal-600 hover:underline font-medium"
          >
            Login here
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;