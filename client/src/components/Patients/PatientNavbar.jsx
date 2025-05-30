import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);

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

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8">
          <Link
            to="/patient"
            className={`py-2 text-xl transition duration-200 ${
              isActive("/patient") ? "underline" : "hover:text-teal-300"
            }`}
          >
            Home
          </Link>
          <Link
            to="/profile"
            className={`py-2 text-xl transition duration-200 ${
              isActive("/profile") ? "underline" : "hover:text-teal-300"
            }`}
          >
            Profile
          </Link>
          <Link
            to="/patient-reports"
            className={`py-2 text-xl transition duration-200 ${
              isActive("/patient-reports") ? "underline" : "hover:text-teal-300"
            }`}
          >
            Reports
          </Link>
          <Link
            to="/patient-payments"
            className={`py-2 text-xl transition duration-200 ${
              isActive("/patient-payments") ? "underline" : "hover:text-teal-300"
            }`}
          >
            Payments
          </Link>
          <Link
            to="/"
            className="bg-red-500 text-xl px-5 py-2 rounded-md hover:bg-red-400 transition duration-200"
          >
            Logout
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="focus:outline-none">
            <svg
              className="w-6 h-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>

          {/* Mobile Dropdown Menu */}
          {isOpen && (
            <div className="absolute top-16 right-4 bg-teal-700 rounded-md shadow-lg z-10 w-48 transition-all duration-300 ease-in-out">
              <Link
                to="/patient"
                className={`block text-xl px-6 py-3 transition duration-200 ${
                  isActive("/patient") ? "underline" : "hover:bg-teal-600"
                }`}
              >
                Home
              </Link>
              <Link
                to="/profile"
                className={`block text-xl px-6 py-3 transition duration-200 ${
                  isActive("/profile") ? "underline" : "hover:bg-teal-600"
                }`}
              >
                Profile
              </Link>
              <Link
                to="/patient-reports"
                className={`block text-xl px-6 py-3 transition duration-200 ${
                  isActive("/patient-reports") ? "underline" : "hover:bg-teal-600"
                }`}
              >
                Reports
              </Link>
              <Link
                to="/patient-payments"
                className={`block text-xl px-6 py-3 transition duration-200 ${
                  isActive("/patient-payments") ? "underline" : "hover:bg-teal-600"
                }`}
              >
                Payments
              </Link>
              <Link
                to="/"
                className="block px-6 text-xl py-3 bg-red-500 rounded-b-md hover:bg-red-400 transition duration-200"
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

export default Navbar;