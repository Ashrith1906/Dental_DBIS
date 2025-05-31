import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from '../../assets/Images/logo.png';

const ReceptionNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { to: "/receptionist", label: "Home" },
    { to: "/patient-profile", label: "Patient Profile" },
    { to: "/patientrecords", label: "Patient Records" },
    { to: "/dentistrecords", label: "Dentist Records" },
    { to: "/invoice", label: "Invoices" },
    { to: "/reports", label: "Reports" },
  ];

  return (
    <nav className="bg-white shadow-xl border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo and Title */}
        <div className="flex items-center space-x-3">
          <img
            src={logo}
            alt="Logo"
            className="h-12 w-12 rounded-full shadow-md"
          />
          <span className="text-3xl font-extrabold text-teal-700 tracking-wide">
            Smile
          </span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-lg font-semibold transition duration-200 ${
                isActive(link.to)
                  ? "text-teal-600 underline underline-offset-4"
                  : "text-gray-600 hover:text-teal-500"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/"
            className="bg-red-500 hover:bg-red-400 text-white text-base font-semibold px-5 py-2 rounded-xl shadow-md transition duration-200"
          >
            Logout
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="text-teal-600 focus:outline-none"
          >
            <svg
              className="w-7 h-7"
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
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden px-6 pt-2 pb-4 bg-gradient-to-br from-blue-50 to-teal-100 rounded-b-2xl shadow-md space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setIsOpen(false)}
              className={`block text-lg font-medium px-4 py-2 rounded-lg transition duration-200 ${
                isActive(link.to)
                  ? "text-teal-700 underline underline-offset-4"
                  : "text-gray-700 hover:bg-teal-100 hover:text-teal-600"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="block bg-red-500 hover:bg-red-400 text-white text-base font-semibold text-center px-4 py-2 rounded-xl shadow-md transition duration-200"
          >
            Logout
          </Link>
        </div>
      )}
    </nav>
  );
};

export default ReceptionNavbar;
