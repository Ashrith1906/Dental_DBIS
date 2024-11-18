import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const ReceptionNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation(); // Get current location

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Function to determine if a link is active
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-teal-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <img
            src="/src/assets/Images/logo.png"
            alt="Logo"
            className="h-12 w-12"
          />
          <div className="text-2xl font-bold">Smile</div>
        </div>
        <div className="hidden md:flex space-x-8">
          <Link
            to="/receptionist"
            className={`py-2 text-xl transition duration-200 ${
              isActive("/receptionist") ? "underline" : "hover:text-teal-200"
            }`}
          >
            Home
          </Link>
          <Link
            to="/patient-profile"
            className={`py-2 text-xl transition duration-200 ${
              isActive("/patient-profile") ? "underline" : "hover:text-teal-200"
            }`}
          >
            Patient Profile
          </Link>
          <Link
            to="/patientrecords"
            className={`py-2 text-xl transition duration-200 ${
              isActive("/patientrecords") ? "underline" : "hover:text-teal-200"
            }`}
          >
            Patient Records
          </Link>
          <Link
            to="/invoice"
            className={`py-2 text-xl transition duration-200 ${
              isActive("/invoice") ? "underline" : "hover:text-teal-200"
            }`}
          >
            Invoices
          </Link>
          <Link
            to="/reports"
            className={`py-2 text-xl transition duration-200 ${
              isActive("/reports") ? "underline" : "hover:text-teal-200"
            }`}
          >
            Reports
          </Link>
          <Link
            to="/"
            className="bg-red-500 text-xl px-5 py-2 rounded-md hover:bg-red-400 transition duration-200"
          >
            Logout
          </Link>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="focus:outline-none">
            <svg
              className="w-6 h-6 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
          {isOpen && (
            <div className="absolute top-16 right-4 w-48 bg-teal-700 rounded-md shadow-lg z-10">
              <Link
                to="/receptionist"
                className={`block text-xl px-6 py-3 transition duration-200 ${
                  isActive("/receptionist")
                    ? "bg-teal-600"
                    : "hover:bg-teal-600 text-teal-100"
                }`}
              >
                Home
              </Link>
              <Link
                to="/patient-profile"
                className={`block px-6 py-3 text-xl transition duration-200 ${
                  isActive("/patient-profile")
                    ? "bg-teal-600"
                    : "hover:bg-teal-600 text-teal-100"
                }`}
              >
                Patient Profile
              </Link>
              <Link
                to="/patientrecords"
                className={`block px-6 py-3 text-xl transition duration-200 ${
                  isActive("/patientrecords")
                    ? "bg-teal-600"
                    : "hover:bg-teal-600 text-teal-100"
                }`}
              >
                Patient Records
              </Link>
              <Link
                to="/invoice"
                className={`block px-6 py-3 text-xl transition duration-200 ${
                  isActive("/invoice")
                    ? "bg-teal-600"
                    : "hover:bg-teal-600 text-teal-100"
                }`}
              >
                Invoice
              </Link>
              <Link
                to="/reports"
                className={`block px-6 py-3 text-xl transition duration-200 ${
                  isActive("/reports")
                    ? "bg-teal-600"
                    : "hover:bg-teal-600 text-teal-100"
                }`}
              >
                Reports
              </Link>
              <Link
                to="/"
                className="block px-6 py-3 text-xl bg-red-500 rounded-b-md hover:bg-red-400 transition duration-200 text-white"
              >
                Logout
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default ReceptionNavbar;
