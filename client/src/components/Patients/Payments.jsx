import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import {
  FaUser, FaBirthdayCake, FaVenusMars, FaTooth, FaCalendarAlt, FaClock
} from "react-icons/fa";
import Navbar from "./PatientNavbar";

const Payments = () => {
  const { patientId } = useAuth();

  const [aptIds, setAptIds] = useState([]);
  const [selectedAptID, setSelectedAptID] = useState("");
  const [appointmentDetails, setAppointmentDetails] = useState(null);
  const [invoice, setInvoice] = useState(null);
  const [invoiceError, setInvoiceError] = useState(false);

  useEffect(() => {
    const fetchAppointmentIDs = async () => {
      if (!patientId) return;

      try {
        const res = await axios.get("http://localhost:3000/api/appointments/getAllAppointmentsByPID", {
          params: { pID: patientId },
        });
        const ids = res.data.appointment.map((apt) => apt.aptID);
        setAptIds(ids);
      } catch (err) {
        console.error("Error fetching appointment IDs", err);
      }
    };

    fetchAppointmentIDs();
  }, [patientId]);

  useEffect(() => {
    if (!selectedAptID) return;

    const fetchDetails = async () => {
      try {
        const [aptRes, invoiceRes] = await Promise.all([
          axios.get(`http://localhost:3000/api/appointments/details/${selectedAptID}`),
          axios.get("http://localhost:3000/api/invoice/get", {
            params: { aptID: selectedAptID },
          }),
        ]);
        setAppointmentDetails(aptRes.data.details);
        setInvoice(invoiceRes.data);
        setInvoiceError(false);
      } catch (error) {
        console.error("Error fetching details", error);
        setAppointmentDetails(null);
        setInvoice(null);
        setInvoiceError(true);
      }
    };

    fetchDetails();
  }, [selectedAptID]);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!invoice || !invoice.items || !selectedAptID) return;

    const loaded = await loadRazorpayScript();
    if (!loaded) {
      alert("Failed to load Razorpay SDK.");
      return;
    }

    const amount = invoice.items.reduce((acc, item) => acc + item.amount, 0);

    try {
      const res = await axios.post("http://localhost:3000/api/razorpay/order", {
        amount: amount * 100,
      });

      const { id: order_id } = res.data;

      const options = {
        key: "rzp_test_iYFDSVHVLuJcMw",
        amount: amount * 100,
        currency: "INR",
        name: "Dental Clinic",
        description: "Invoice Payment",
        order_id,
        handler: async () => {
          try {
            // Update payment status in DB
            await axios.put("http://localhost:3000/api/invoice/pay", {
              aptID: selectedAptID,
            });

            // Refetch updated data
            const [aptRes, invoiceRes] = await Promise.all([
              axios.get(`http://localhost:3000/api/appointments/details/${selectedAptID}`),
              axios.get("http://localhost:3000/api/invoice/get", {
                params: { aptID: selectedAptID },
              }),
            ]);

            // Update state
            setAppointmentDetails(aptRes.data.details);
            setInvoice(invoiceRes.data);
            setInvoiceError(false);

            alert("Payment successful!");
          } catch (err) {
            console.error("Error updating after payment", err);
            alert("Payment succeeded but invoice update failed.");
          }
        },
        theme: { color: "#06b6d4" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment failed", error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="p-6 max-w-3xl mx-auto">
        <h2 className="text-3xl font-semibold mb-6 text-teal-600 text-center">Pay Your Invoices</h2>

        <label className="block mb-2 text-lg">Select Appointment</label>
        <select
          className="w-full mb-6 p-2 border rounded"
          value={selectedAptID}
          onChange={(e) => setSelectedAptID(e.target.value)}
        >
          <option value="">-- Select --</option>
          {aptIds.map((aptID) => (
            <option key={aptID} value={aptID}>
              {aptID}
            </option>
          ))}
        </select>

        {appointmentDetails && (
          <div className="mb-6 border p-4 rounded shadow bg-gray-50">
            <h3 className="text-xl font-semibold mb-2 text-teal-700">Appointment Details</h3>
            <ul className="space-y-1 text-gray-700">
              <li><FaUser className="inline text-teal-500 mr-2" /> {appointmentDetails.patient.name}</li>
              <li><FaBirthdayCake className="inline text-teal-500 mr-2" /> Age: {appointmentDetails.patient.age}</li>
              <li><FaVenusMars className="inline text-teal-500 mr-2" /> Gender: {appointmentDetails.patient.gender}</li>
              <li><FaTooth className="inline text-teal-500 mr-2" /> Dentist: {appointmentDetails.dentist.name}</li>
              <li><FaCalendarAlt className="inline text-teal-500 mr-2" /> Date: {new Date(appointmentDetails.appointment.date).toLocaleDateString()}</li>
              <li><FaClock className="inline text-teal-500 mr-2" /> Time: {appointmentDetails.appointment.time}</li>
            </ul>
          </div>
        )}

        {invoice ? (
          <div className="border p-4 rounded shadow-md bg-white">
            <h3 className="text-xl font-semibold mb-3">Invoice Details</h3>
            <p><strong>Invoice Date:</strong> {new Date(invoice.invoice_date).toLocaleDateString()}</p>
            <p><strong>Payment Status:</strong> {invoice.payment_status ? "Paid" : "Unpaid"}</p>
            <ul className="mt-3 space-y-2">
              {invoice.items.map((item, idx) => (
                <li key={idx} className="flex justify-between">
                  <span>{item.description}</span>
                  <span>₹{item.amount}</span>
                </li>
              ))}
            </ul>
            <hr className="my-3" />
            <p className="text-right font-bold">
              Total: ₹{invoice.items.reduce((acc, item) => acc + item.amount, 0)}
            </p>

            {!invoice.payment_status && (
              <button
                className="mt-4 bg-teal-600 text-white px-4 py-2 rounded"
                onClick={handlePayment}
              >
                Pay Now
              </button>
            )}

            <div className="flex justify-center mt-4">
              <button
                onClick={() => window.print()}
                className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded"
              >
                Print Invoice
              </button>
            </div>
          </div>
        ) : (
          invoiceError && selectedAptID && (
            <p className="text-red-600 font-semibold text-center mt-4">
              Invoice not yet posted. Please wait until it is uploaded.
            </p>
          )
        )}
      </div>
    </div>
  );
};

export default Payments;