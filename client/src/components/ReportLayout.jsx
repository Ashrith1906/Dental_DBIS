import { FaPhone, FaEnvelope } from "react-icons/fa";
import logo from "../assets/Images/logo.png";
const ReportLayout = ({ appointmentDetails, reportDetails }) => {
  if (!appointmentDetails || !reportDetails) return null;

  const { patient, dentist, appointment } = appointmentDetails;
  const currentDate = new Date().toLocaleDateString();

  return (
    <div className="relative font-sans text-[15px] p-10 bg-white text-black max-w-4xl mx-auto border border-gray-300 rounded-lg shadow-md">
      {/* Optional watermark/logo background */}
      <div className="absolute inset-0 flex justify-center items-center pointer-events-none opacity-10 z-0">
        <img src={logo} alt="Smile Dental Clinic" className="w-64 h-64" />
      </div>

      {/* Header */}
      <div className="text-center relative z-10 mb-8">
        <h1 className="text-3xl font-bold text-blue-700">
          Smile Dental Clinic
        </h1>
        <p className="text-sm text-gray-600 mt-1">Date: {currentDate}</p>
        <h2 className="text-xl font-semibold mt-4 underline">
          Appointment Report
        </h2>
      </div>

      {/* Info Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
        {/* Patient Info */}
        <div className="border p-4 rounded-md">
          <h3 className="font-semibold text-lg mb-2 text-blue-600">
            Patient Information
          </h3>
          <p>
            <strong>Name:</strong> {patient.name}
          </p>
          <p>
            <strong>Age:</strong> {patient.age}
          </p>
          <p>
            <strong>Gender:</strong> {patient.gender}
          </p>
          <p className="flex items-center gap-2">
            <FaPhone className="text-blue-500" /> {patient.phone}
          </p>
          <p>
            <strong>Address:</strong> {patient.address}
          </p>
          <p>
            <strong>Past History:</strong> {patient.history}
          </p>
        </div>

        {/* Dentist Info */}
        <div className="border p-4 rounded-md">
          <h3 className="font-semibold text-lg mb-2 text-blue-600">
            Dentist Information
          </h3>
          <p>
            <strong>Name:</strong> {dentist.name}
          </p>
          <p>
            <strong>Specialization:</strong> {dentist.specialization}
          </p>
          <p>
            <strong>Experience:</strong> {dentist.experience} years
          </p>
          <p className="flex items-center gap-2">
            <FaPhone className="text-blue-500" /> {dentist.phone}
          </p>
          <p className="flex items-center gap-2">
            <FaEnvelope className="text-blue-500" /> {dentist.email}
          </p>
        </div>
      </div>

      {/* Appointment Info */}
      <div className="border mt-6 p-4 rounded-md relative z-10">
        <h3 className="font-semibold text-lg mb-2 text-blue-600">
          Appointment Details
        </h3>
        <p>
          <strong>Appointment ID:</strong> {appointment.aptID}
        </p>
        <p>
          <strong>Date:</strong>{" "}
          {new Date(appointment.date).toLocaleDateString()}
        </p>
        <p>
          <strong>Time:</strong> {appointment.time}
        </p>
        <p>
          <strong>Reason:</strong> {appointment.reason}
        </p>
        <p>
          <strong>Status:</strong> {appointment.status}
        </p>
      </div>

      {/* Report Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 relative z-10">
        <div className="border p-4 rounded-md">
          <h3 className="font-semibold text-lg mb-2 text-blue-600">
            Primary Diagnosis
          </h3>
          <p className="pl-2">{reportDetails.primaryDiagnosis}</p>
        </div>

        <div className="border p-4 rounded-md">
          <h3 className="font-semibold text-lg mb-2 text-blue-600">
            Prescription
          </h3>
          <p className="pl-2">{reportDetails.prescription}</p>
        </div>
      </div>

      <div className="border mt-6 p-4 rounded-md relative z-10">
        <h3 className="font-semibold text-lg mb-2 text-blue-600">Procedures</h3>
        <p className="pl-2">{reportDetails.procedures}</p>
      </div>

      {/* Signature */}
      <div className="text-right mt-8 relative z-10">
        <p className="italic text-base">
          Dentist's Signature: ______________________
        </p>
      </div>

      {/* Footer */}
      <div className="text-center mt-12 pt-4 border-t border-gray-300 text-gray-500 text-xs relative z-10">
        <p>
          Disclaimer: This report is for testing purposes only and is still
          under development.
        </p>
      </div>
    </div>
  );
};

export default ReportLayout;
