import { FaPhone, FaEnvelope } from "react-icons/fa";
import logo from "../assets/Images/logo.png";

const InvoiceLayout = ({ appointmentDetails, invoiceDetails }) => {
  if (!appointmentDetails || !invoiceDetails) return null;

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
          Appointment Invoice
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

      {/* Printable Invoice Content */}
      <div className="bg-white p-6 rounded-2xl shadow-2xl text-gray-800 print:shadow-none print:p-0">
        <h2 className="text-2xl font-bold text-center text-teal-700 mb-6">
          Invoice Details
        </h2>

        {/* Date and Payment Status */}
        <div className="flex justify-between text-sm mb-4">
          <p>
            <strong>Invoice Date:</strong>{" "}
            {new Date(invoiceDetails.invoice_date).toLocaleDateString()}
          </p>
          <p>
            <strong>Payment Status:</strong>{" "}
            {invoiceDetails.payment_status ? "Paid" : "Unpaid"}
          </p>
        </div>

        {/* Items List */}
        <div className="border rounded-md p-4 mb-4">
          <h3 className="text-lg font-semibold text-teal-600 mb-4">
            Invoice Items
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border border-gray-300">
              <thead className="bg-teal-100 text-teal-800 font-semibold">
                <tr>
                  <th className="px-4 py-2 border-b border-gray-300">#</th>
                  <th className="px-4 py-2 border-b border-gray-300">
                    Description
                  </th>
                  <th className="px-4 py-2 border-b border-gray-300 text-right">
                    Amount (₹)
                  </th>
                </tr>
              </thead>
              <tbody>
                {invoiceDetails.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-teal-50">
                    <td className="px-4 py-2 border-b border-gray-200">
                      {idx + 1}
                    </td>
                    <td className="px-4 py-2 border-b border-gray-200">
                      {item.description}
                    </td>
                    <td className="px-4 py-2 border-b border-gray-200 text-right">
                      ₹{item.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-teal-50">
                  <td
                    colSpan="2"
                    className="px-4 py-2 text-right font-semibold border-t border-gray-300"
                  >
                    Total
                  </td>
                  <td className="px-4 py-2 text-right font-bold border-t border-gray-300 text-teal-900">
                    ₹
                    {invoiceDetails.items.reduce(
                      (acc, item) => acc + item.amount,
                      0
                    )}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Digitally Verified Stamp */}
        <div className="text-right mt-8 relative z-10">
          <div className="inline-block px-6 py-2 border-2 border-teal-600 text-teal-700 font-semibold text-sm rounded-xl tracking-wide uppercase">
            ✅ Digitally Verified by Clinic
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 pt-4 border-t border-gray-300 text-gray-500 text-xs relative z-10">
          <p>
            Disclaimer: This invoice is for testing purposes only and is still
            under development.
          </p>
        </div>
      </div>
    </div>
  );
};

export default InvoiceLayout;
