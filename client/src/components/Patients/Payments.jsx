// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useAuth } from "../contexts/AuthContext";
// import {
//   FaUser,
//   FaBirthdayCake,
//   FaVenusMars,
//   FaTooth,
//   FaCalendarAlt,
//   FaClock,
// } from "react-icons/fa";
// import Navbar from "./PatientNavbar";

// const Payments = () => {
//   const { patientId } = useAuth();

//   const [aptIds, setAptIds] = useState([]);
//   const [selectedAptID, setSelectedAptID] = useState("");
//   const [appointmentDetails, setAppointmentDetails] = useState(null);
//   const [invoice, setInvoice] = useState(null);
//   const [invoiceError, setInvoiceError] = useState(false);

//   useEffect(() => {
//     const fetchAppointmentIDs = async () => {
//       if (!patientId) return;

//       try {
//         const res = await axios.get(
//           `${
//             import.meta.env.VITE_API_BASE_URL
//           }appointments/getAllAppointmentsByPID`,
//           {
//             params: { pID: patientId },
//           }
//         );
//         const ids = res.data.appointment.map((apt) => apt.aptID);
//         setAptIds(ids);
//       } catch (err) {
//         console.error("Error fetching appointment IDs", err);
//       }
//     };

//     fetchAppointmentIDs();
//   }, [patientId]);

//   useEffect(() => {
//     if (!selectedAptID) return;

//     const fetchDetails = async () => {
//       try {
//         const [aptRes, invoiceRes] = await Promise.all([
//           axios.get(
//             `${
//               import.meta.env.VITE_API_BASE_URL
//             }appointments/details/${selectedAptID}`
//           ),
//           axios.get(`${import.meta.env.VITE_API_BASE_URL}invoice/get`, {
//             params: { aptID: selectedAptID },
//           }),
//         ]);
//         setAppointmentDetails(aptRes.data.details);
//         setInvoice(invoiceRes.data);
//         setInvoiceError(false);
//       } catch (error) {
//         console.error("Error fetching details", error);
//         setAppointmentDetails(null);
//         setInvoice(null);
//         setInvoiceError(true);
//       }
//     };

//     fetchDetails();
//   }, [selectedAptID]);

//   const loadRazorpayScript = () => {
//     return new Promise((resolve) => {
//       const script = document.createElement("script");
//       script.src = "https://checkout.razorpay.com/v1/checkout.js";
//       script.onload = () => resolve(true);
//       script.onerror = () => resolve(false);
//       document.body.appendChild(script);
//     });
//   };

//   const handlePayment = async () => {
//     if (!invoice || !invoice.items || !selectedAptID) return;

//     const loaded = await loadRazorpayScript();
//     if (!loaded) {
//       alert("Failed to load Razorpay SDK.");
//       return;
//     }

//     const amount = invoice.items.reduce((acc, item) => acc + item.amount, 0);

//     try {
//       const res = await axios.post(
//         `${import.meta.env.VITE_API_BASE_URL}razorpay/order`,
//         {
//           amount: amount * 100,
//         }
//       );

//       const { id: order_id } = res.data;

//       const options = {
//         key: "rzp_test_iYFDSVHVLuJcMw",
//         amount: amount * 100,
//         currency: "INR",
//         name: "Smile Dental Clinic",
//         description: "Invoice Payment",
//         order_id,
//         handler: async () => {
//           try {
//             await axios.put(`${import.meta.env.VITE_API_BASE_URL}invoice/pay`, {
//               aptID: selectedAptID,
//             });

//             const [aptRes, invoiceRes] = await Promise.all([
//               axios.get(
//                 `${
//                   import.meta.env.VITE_API_BASE_URL
//                 }appointments/details/${selectedAptID}`
//               ),
//               axios.get(`${import.meta.env.VITE_API_BASE_URL}invoice/get`, {
//                 params: { aptID: selectedAptID },
//               }),
//             ]);

//             setAppointmentDetails(aptRes.data.details);
//             setInvoice(invoiceRes.data);
//             setInvoiceError(false);

//             alert("Payment successful!");
//           } catch (err) {
//             console.error("Error updating after payment", err);
//             alert("Payment succeeded but invoice update failed.");
//           }
//         },
//         theme: { color: "#14B8A6" },
//       };

//       const rzp = new window.Razorpay(options);
//       rzp.open();
//     } catch (error) {
//       console.error("Payment failed", error);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-100">
//       <Navbar />
//       <div className="max-w-3xl mx-auto p-8">
//         <h2 className="text-3xl font-extrabold text-teal-700 text-center mb-6">
//           Pay Your Invoices
//         </h2>
//         <div className="mb-6 border p-6 rounded-2xl shadow-xl bg-white">
//           <label className="block text-sm font-semibold text-teal-900 mb-2">
//             Select Appointment
//           </label>
//           <select
//             className="w-full p-3 rounded-xl bg-gray-50 border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-400"
//             value={selectedAptID}
//             onChange={(e) => setSelectedAptID(e.target.value)}
//           >
//             <option value="">-- Select --</option>
//             {aptIds.map((aptID) => (
//               <option key={aptID} value={aptID}>
//                 {aptID}
//               </option>
//             ))}
//           </select>
//         </div>

//         {appointmentDetails && (
//           <div className="bg-white p-6 rounded-2xl shadow-xl mb-6">
//             <h3 className="text-xl font-semibold text-teal-700 mb-4">
//               Appointment Details
//             </h3>
//             <ul className="space-y-2 text-gray-600">
//               <li>
//                 <FaUser className="inline text-teal-500 mr-2" />{" "}
//                 {appointmentDetails.patient.name}
//               </li>
//               <li>
//                 <FaBirthdayCake className="inline text-teal-500 mr-2" /> Age:{" "}
//                 {appointmentDetails.patient.age}
//               </li>
//               <li>
//                 <FaVenusMars className="inline text-teal-500 mr-2" /> Gender:{" "}
//                 {appointmentDetails.patient.gender}
//               </li>
//               <li>
//                 <FaTooth className="inline text-teal-500 mr-2" /> Dentist:{" "}
//                 {appointmentDetails.dentist.name}
//               </li>
//               <li>
//                 <FaCalendarAlt className="inline text-teal-500 mr-2" /> Date:{" "}
//                 {new Date(
//                   appointmentDetails.appointment.date
//                 ).toLocaleDateString()}
//               </li>
//               <li>
//                 <FaClock className="inline text-teal-500 mr-2" /> Time:{" "}
//                 {appointmentDetails.appointment.time}
//               </li>
//             </ul>
//           </div>
//         )}

//         {invoice ? (
//           <div className="bg-white p-6 rounded-2xl shadow-2xl">
//             <h3 className="text-xl font-semibold text-teal-700 mb-4">
//               Invoice Details
//             </h3>
//             <p className="text-gray-600">
//               <strong>Invoice Date:</strong>{" "}
//               {new Date(invoice.invoice_date).toLocaleDateString()}
//             </p>
//             <p className="text-gray-600">
//               <strong>Payment Status:</strong>{" "}
//               {invoice.payment_status ? "Paid" : "Unpaid"}
//             </p>

//             <ul className="mt-4 space-y-2 text-gray-700">
//               {invoice.items.map((item, idx) => (
//                 <li key={idx} className="flex justify-between">
//                   <span>{item.description}</span>
//                   <span>₹{item.amount}</span>
//                 </li>
//               ))}
//             </ul>
//             <hr className="my-4" />
//             <p className="text-right font-bold text-teal-900">
//               Total: ₹
//               {invoice.items.reduce((acc, item) => acc + item.amount, 0)}
//             </p>

//             {!invoice.payment_status && (
//               <button
//                 className="w-full mt-6 bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3 rounded-xl shadow-md transition"
//                 onClick={handlePayment}
//               >
//                 Pay Now
//               </button>
//             )}

//             <div className="flex justify-center mt-6">
//               <button
//                 onClick={() => window.print()}
//                 className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-6 rounded-xl shadow-md transition"
//               >
//                 Print Invoice
//               </button>
//             </div>
//           </div>
//         ) : (
//           invoiceError &&
//           selectedAptID && (
//             <p className="text-red-600 font-semibold text-center mt-4">
//               Invoice not yet posted. Please wait until it is uploaded.
//             </p>
//           )
//         )}
//       </div>
//     </div>
//   );
// };

// export default Payments;

import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import {
  FaUser,
  FaBirthdayCake,
  FaVenusMars,
  FaTooth,
  FaCalendarAlt,
  FaClock,
  FaExclamationCircle,
} from "react-icons/fa";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import Navbar from "./PatientNavbar";
import InvoiceLayout from "../InvoiceLayout";
import { renderToStaticMarkup } from "react-dom/server";
import Footer from "../Footer";

const Payments = () => {
  const { patientId } = useAuth();

  const [aptIds, setAptIds] = useState([]);
  const [selectedAptID, setSelectedAptID] = useState("");
  const [appointmentDetails, setAppointmentDetails] = useState(null);
  const [invoice, setInvoice] = useState(null);
  const [invoiceError, setInvoiceError] = useState(false);

  const [loadingApts, setLoadingApts] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [loadingInvoice, setLoadingInvoice] = useState(false);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    const fetchAppointmentIDs = async () => {
      if (!patientId) return;
      setLoadingApts(true);
      try {
        const res = await axios.get(
          `${
            import.meta.env.VITE_API_BASE_URL
          }appointments/getAllAppointmentsByPID`,
          {
            params: { pID: patientId },
          }
        );
        setAptIds(res.data.appointment.map((apt) => apt.aptID));
      } catch (err) {
        toast.error("Error fetching appointment IDs");
        console.error(err);
      } finally {
        setLoadingApts(false);
      }
    };

    fetchAppointmentIDs();
  }, [patientId]);

  useEffect(() => {
    if (!selectedAptID) return;

    const fetchDetails = async () => {
      setLoadingDetails(true);
      try {
        const [aptRes, invoiceRes] = await Promise.all([
          axios.get(
            `${
              import.meta.env.VITE_API_BASE_URL
            }appointments/details/${selectedAptID}`
          ),
          axios.get(`${import.meta.env.VITE_API_BASE_URL}invoice/get`, {
            params: { aptID: selectedAptID },
          }),
        ]);
        setAppointmentDetails(aptRes.data.details);
        setInvoice(invoiceRes.data);
        setInvoiceError(false);
      } catch (err) {
        console.error("Error fetching appointment or invoice", err);

        // Only toast if it's not due to invoice not posted yet
        if (err.response?.status !== 404) {
          toast.error("Failed to fetch appointment or invoice");
        }

        setAppointmentDetails(null);
        setInvoice(null);
        setInvoiceError(true);
      } finally {
        setLoadingDetails(false);
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

    setPaying(true);
    const loaded = await loadRazorpayScript();
    if (!loaded) {
      toast.error("Failed to load Razorpay SDK");
      setPaying(false);
      return;
    }

    const amount = invoice.items.reduce((acc, item) => acc + item.amount, 0);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}razorpay/order`,
        {
          amount: amount * 100,
        }
      );

      const options = {
        key: "rzp_test_iYFDSVHVLuJcMw",
        amount: amount * 100,
        currency: "INR",
        name: "Smile Dental Clinic",
        description: "Invoice Payment",
        order_id: res.data.id,
        handler: async () => {
          try {
            await axios.put(`${import.meta.env.VITE_API_BASE_URL}invoice/pay`, {
              aptID: selectedAptID,
            });

            const [aptRes, invoiceRes] = await Promise.all([
              axios.get(
                `${
                  import.meta.env.VITE_API_BASE_URL
                }appointments/details/${selectedAptID}`
              ),
              axios.get(`${import.meta.env.VITE_API_BASE_URL}invoice/get`, {
                params: { aptID: selectedAptID },
              }),
            ]);
            setAppointmentDetails(aptRes.data.details);
            setInvoice(invoiceRes.data);
            toast.success("Payment successful!");
          } catch (err) {
            console.error("Invoice update failed after payment", err);
            toast.error("Payment succeeded, but invoice update failed.");
          }
        },
        theme: { color: "#14B8A6" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Payment error", err);
      toast.error("Payment initiation failed");
    } finally {
      setPaying(false);
    }
  };

  const handlePrint = () => {
    if (!appointmentDetails || !invoice) {
      toast.error("Missing appointment or invoice details.");
      return;
    }

    setLoadingInvoice(true); // Start loading

    const htmlContent = renderToStaticMarkup(
      <InvoiceLayout
        appointmentDetails={appointmentDetails}
        invoiceDetails={invoice}
      />
    );

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast.error("Popup blocked! Please allow popups to print the invoice.");
      setLoadingInvoice(false); // Reset loading on failure
      return;
    }

    printWindow.document.write(`
    <html>
      <head>
        <title>Invoice</title>
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
        <style>
          @media print {
            body {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
          }
        </style>
      </head>
      <body class="bg-white p-10">
        ${htmlContent}
      </body>
    </html>
  `);

    printWindow.document.close();
    printWindow.focus();

    // Let the content load before printing
    setTimeout(() => {
      try {
        printWindow.print();
      } catch (e) {
        toast.error("Print failed.");
        console.error("Print error:", e);
      } finally {
        setLoadingInvoice(false); // Reset loading after print
      }
    }, 500);
  };

  return (
  <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-teal-100">
    <Navbar />
    {/* Main Content */}
<div className="flex-grow w-full max-w-3xl mx-auto px-6 py-10">
      <h2 className="text-3xl font-extrabold text-teal-700 text-center mb-6">
          Pay Your Invoices
        </h2>

        {/* Select Appointment */}
        <div className="mb-6 border p-6 rounded-2xl shadow-xl bg-white">
          <label className="block text-sm font-semibold text-teal-900 mb-2">
            Select Appointment
          </label>
          <select
            className="w-full p-3 rounded-xl bg-gray-50 border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-400"
            value={selectedAptID}
            onChange={(e) => setSelectedAptID(e.target.value)}
          >
            <option value="">-- Select --</option>
            {aptIds.map((id) => (
              <option key={id} value={id}>
                {id}
              </option>
            ))}
          </select>
        </div>

        {loadingApts || loadingDetails ? (
          <div className="flex justify-center mt-8">
            <Loader2 className="animate-spin h-8 w-8 text-teal-500" />
          </div>
        ) : (
          <>
            {/* Appointment Info */}
            {appointmentDetails && (
              <div className="bg-white p-6 rounded-2xl shadow-xl mb-6">
                <h3 className="text-xl font-semibold text-teal-700 mb-4">
                  Appointment Details
                </h3>
                <ul className="space-y-2 text-gray-600">
                  <li>
                    <FaUser className="inline text-teal-500 mr-2" />
                    {appointmentDetails.patient.name}
                  </li>
                  <li>
                    <FaBirthdayCake className="inline text-teal-500 mr-2" />
                    Age: {appointmentDetails.patient.age}
                  </li>
                  <li>
                    <FaVenusMars className="inline text-teal-500 mr-2" />
                    Gender: {appointmentDetails.patient.gender}
                  </li>
                  <li>
                    <FaTooth className="inline text-teal-500 mr-2" />
                    Dentist: {appointmentDetails.dentist.name}
                  </li>
                  <li>
                    <FaCalendarAlt className="inline text-teal-500 mr-2" />
                    Date:{" "}
                    {new Date(
                      appointmentDetails.appointment.date
                    ).toLocaleDateString()}
                  </li>
                  <li>
                    <FaClock className="inline text-teal-500 mr-2" />
                    Time: {appointmentDetails.appointment.time}
                  </li>
                </ul>
              </div>
            )}

            {/* Invoice Info */}
            {invoice ? (
              <div className="bg-white p-6 rounded-2xl shadow-2xl">
                <h3 className="text-xl font-semibold text-teal-700 mb-4">
                  Invoice Details
                </h3>
                <p className="text-gray-600">
                  <strong>Invoice Date:</strong>{" "}
                  {new Date(invoice.invoice_date).toLocaleDateString()}
                </p>
                <p className="text-gray-600">
                  <strong>Payment Status:</strong>{" "}
                  {invoice.payment_status ? "Paid" : "Unpaid"}
                </p>

                <ul className="mt-4 space-y-2 text-gray-700">
                  {invoice.items.map((item, idx) => (
                    <li key={idx} className="flex justify-between">
                      <span>{item.description}</span>
                      <span>₹{item.amount}</span>
                    </li>
                  ))}
                </ul>
                <hr className="my-4" />
                <p className="text-right font-bold text-teal-900">
                  Total: ₹
                  {invoice.items.reduce((acc, item) => acc + item.amount, 0)}
                </p>

                {!invoice.payment_status && (
                  <button
                    className="w-full mt-6 bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3 rounded-xl shadow-md transition flex justify-center items-center"
                    onClick={handlePayment}
                    disabled={paying}
                  >
                    {paying ? (
                      <Loader2 className="animate-spin h-5 w-5" />
                    ) : (
                      "Pay Now"
                    )}
                  </button>
                )}

                <div className="flex justify-center mt-6">
                  <button
                    type="button"
                    onClick={handlePrint}
                    disabled={loadingInvoice}
                    className={`px-6 py-3 font-bold rounded-xl text-white ${
                      loadingInvoice
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gray-600 hover:bg-gray-700"
                    } shadow-md transition flex items-center gap-2`}
                  >
                    {loadingInvoice && (
                      <Loader2 className="animate-spin" size={18} />
                    )}
                    {loadingInvoice ? "Loading Invoice..." : "Print Invoice"}
                  </button>
                </div>
              </div>
            ) : (
              invoiceError &&
              selectedAptID && (
                <div className="bg-yellow-50 border border-yellow-300 text-yellow-800 px-6 py-5 rounded-2xl shadow-md mt-6 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <FaExclamationCircle className="text-yellow-500 w-8 h-8 mb-2" />
                    <p className="font-semibold">Invoice not yet posted</p>
                    <p className="text-sm text-gray-600">
                      Please wait while the staff uploads the invoice.
                    </p>
                  </div>
                </div>
              )
            )}
          </>
        )}
      </div>
      <Footer/>
    </div>
  );
};

export default Payments;
