// import { useState, useEffect } from "react";
// import axios from "axios";
// import ReceptionNavbar from "./ReceptionNavbar";
// import {
//   FaUser,
//   FaCalendarAlt,
//   FaClock,
//   FaTooth,
//   FaVenusMars,
//   FaBirthdayCake,
// } from "react-icons/fa";
// const Invoice = () => {
//   const [aptID, setAptID] = useState("");
//   const [searchAptID, setSearchAptID] = useState("");
//   const [appointments, setAppointments] = useState([]);
//   const [appointmentDetails, setAppointmentDetails] = useState(null);
//   const [invoiceDetails, setInvoiceDetails] = useState({
//     invoice_date: new Date().toISOString().slice(0, 10), // Default to today's date
//     payment_status: false,
//     items: [],
//   });
//   const [isEditing, setIsEditing] = useState(false);
//   const [error, setError] = useState("");

//   // Fetch all appointments on component mount
//   useEffect(() => {
//     const fetchAppointments = async () => {
//       try {
//         const response = await axios.get(
//           `${import.meta.env.VITE_API_BASE_URL}appointments/getAllAppointments`
//         );
//         setAppointments(response.data.appointment || []);
//       } catch (error) {
//         console.error("Failed to fetch appointments:", error);
//         alert("Unable to fetch appointments. Please try again.");
//       }
//     };

//     fetchAppointments();
//   }, []);

//   // Fetch appointment details
//   useEffect(() => {
//     const fetchAppointmentDetails = async () => {
//       if (!searchAptID) return;

//       try {
//         const response = await axios.get(
//           `${
//             import.meta.env.VITE_API_BASE_URL
//           }appointments/details/${searchAptID}`
//         );
//         setAppointmentDetails(response.data.details);
//       } catch (error) {
//         console.error("Failed to fetch appointment details:", error);
//         alert("Unable to fetch appointment details. Please try again.");
//       }
//     };

//     fetchAppointmentDetails();
//   }, [searchAptID]);

//   // Fetch invoice details
//   const fetchInvoice = async () => {
//     if (!searchAptID) return;

//     try {
//       const response = await axios.get(
//         `${import.meta.env.VITE_API_BASE_URL}invoice/get`,
//         { params: { aptID: searchAptID } }
//       );
//       const { data } = response;
//       if (data) {
//         // Format the date correctly and populate the form
//         setInvoiceDetails({
//           ...data,
//           invoice_date: data.invoice_date
//             ? new Date(data.invoice_date).toISOString().slice(0, 10)
//             : new Date().toISOString().slice(0, 10),
//         });
//         setIsEditing(true);
//       } else {
//         // No invoice found, switch to create mode
//         alert("No invoice found. Switching to create mode.");
//         setInvoiceDetails({
//           invoice_date: new Date().toISOString().slice(0, 10),
//           payment_status: false,
//           items: [],
//         });
//         setIsEditing(false);
//       }
//     } catch (error) {
//       console.error("Failed to fetch invoice:", error);
//       alert("Unable to fetch invoice. Switching to create mode.");
//       setInvoiceDetails({
//         invoice_date: new Date().toISOString().slice(0, 10),
//         payment_status: false,
//         items: [],
//       });
//       setIsEditing(false);
//     }
//   };

//   useEffect(() => {
//     if (searchAptID) fetchInvoice();
//   }, [searchAptID]);

//   const handleInvoiceSubmit = async (e) => {
//     e.preventDefault();

//     if (!invoiceDetails.invoice_date || invoiceDetails.items.length === 0) {
//       setError("All fields are required.");
//       return;
//     }

//     try {
//       const endpoint = isEditing
//         ? `${import.meta.env.VITE_API_BASE_URL}invoice/update`
//         : `${import.meta.env.VITE_API_BASE_URL}invoice/create`;
//       const method = isEditing ? "put" : "post";
//       const response = await axios[method](endpoint, {
//         aptID: searchAptID,
//         ...invoiceDetails,
//       });

//       alert(response.data.message || "Invoice saved successfully!");
//       fetchInvoice(); // Reload the updated invoice
//       setIsEditing(true);
//       setError("");
//     } catch (error) {
//       console.error("Failed to save invoice:", error);
//       alert("Failed to save invoice. Please try again.");
//     }
//   };

//   const handleAddItem = () => {
//     setInvoiceDetails((prev) => ({
//       ...prev,
//       items: [...prev.items, { description: "", amount: 0 }],
//     }));
//   };

//   const handleRemoveItem = (index) => {
//     setInvoiceDetails((prev) => ({
//       ...prev,
//       items: prev.items.filter((_, i) => i !== index),
//     }));
//   };

//   const handlePrint = () => {
//     if (!invoiceDetails || !appointmentDetails) {
//       alert("No complete details available to print.");
//       return;
//     }

//     const printWindow = window.open("", "_blank");
//     printWindow.document.write(`
//       <html>
//         <head>
//           <title>Invoice - Appointment ID: ${searchAptID}</title>
//           <style>
//             /* You can adjust the style as needed */
//             body {
//               font-family: Arial, sans-serif;
//               padding: 20px;
//               color: #333;
//             }
//             .container {
//               width: 80%;
//               margin: 0 auto;
//               padding: 20px;
//               border: 1px solid #ddd;
//               border-radius: 10px;
//               background-color: #fff;
//             }
//             h1, h2 {
//               text-align: center;
//               color: #007bff;
//             }
//             .section {
//               margin-bottom: 20px;
//             }
//             .section ul {
//               list-style-type: none;
//               padding: 0;
//             }
//             .section li {
//               margin-bottom: 10px;
//             }
//             .section li span {
//               font-weight: bold;
//             }
//             .table {
//               width: 100%;
//               border-collapse: collapse;
//               margin-top: 20px;
//             }
//             .table th, .table td {
//               padding: 8px;
//               border: 1px solid #ddd;
//               text-align: left;
//             }
//             .total {
//               font-size: 18px;
//               font-weight: bold;
//               text-align: right;
//             }
//           </style>
//         </head>
//         <body>
//           <div class="container">
//             <h1>Invoice - Appointment ID: ${searchAptID}</h1>

//             <!-- Appointment Details -->
//             <div class="section">
//               <h2>Appointment Details</h2>
//               <ul>
//                 <li><span>Appointment ID:</span> ${
//                   appointmentDetails.appointment.aptID
//                 }</li>
//                 <li><span>Date:</span> ${new Date(
//                   appointmentDetails.appointment.date
//                 ).toLocaleDateString()}</li>
//                 <li><span>Time:</span> ${
//                   appointmentDetails.appointment.time
//                 }</li>
//               </ul>
//             </div>

//             <!-- Patient Details -->
//             <div class="section">
//               <h2>Patient Details</h2>
//               <ul>
//                 <li><span>Name:</span> ${appointmentDetails.patient.name}</li>
//                 <li><span>Age:</span> ${appointmentDetails.patient.age}</li>
//                 <li><span>Gender:</span> ${
//                   appointmentDetails.patient.gender
//                 }</li>
//               </ul>
//             </div>

//             <!-- Dentist Details -->
//             <div class="section">
//               <h2>Dentist Details</h2>
//               <ul>
//                 <li><span>Name:</span> ${appointmentDetails.dentist.name}</li>
//                 <li><span>Specialization:</span> ${
//                   appointmentDetails.dentist.specialization
//                 }</li>
//               </ul>
//             </div>

//             <!-- Invoice Details -->
//             <div class="section">
//               <h2>Invoice Details</h2>
//               <p><span>Invoice Date:</span> ${new Date(
//                 invoiceDetails.invoice_date
//               ).toLocaleDateString()}</p>
//               <p><span>Payment Status:</span> ${
//                 invoiceDetails.payment_status ? "Paid" : "Unpaid"
//               }</p>

//               <!-- Items -->
//               <table class="table">
//                 <thead>
//                   <tr>
//                     <th>Description</th>
//                     <th>Amount</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   ${invoiceDetails.items
//                     .map(
//                       (item) =>
//                         `<tr><td>${
//                           item.description
//                         }</td><td>$${item.amount.toFixed(2)}</td></tr>`
//                     )
//                     .join("")}
//                 </tbody>
//               </table>

//               <!-- Total Amount -->
//               <p class="total">Total Amount: $${invoiceDetails.items
//                 .reduce((sum, item) => sum + item.amount, 0)
//                 .toFixed(2)}</p>
//             </div>
//           </div>
//         </body>
//       </html>
//     `);
//     printWindow.document.close();
//     printWindow.print();
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-100">
//       <ReceptionNavbar />
//       <div className="flex justify-center items-start pt-10 px-5">
//         <div className="w-full max-w-4xl bg-white p-8 rounded-2xl shadow-2xl border border-gray-300">
//           <h1 className="text-3xl font-extrabold text-teal-700 mb-6">
//             Invoice
//           </h1>

//           {/* Appointment Selector */}
//           <div className="mb-6">
//             <label
//               htmlFor="appointment"
//               className="block text-sm font-semibold text-teal-900 mb-1"
//             >
//               Appointment ID
//             </label>
//             <select
//               id="appointment"
//               className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400"
//               value={aptID}
//               onChange={(e) => {
//                 setAptID(e.target.value);
//                 setSearchAptID(e.target.value);
//               }}
//             >
//               <option value="">Select Appointment ID</option>
//               {appointments.map((apt) => (
//                 <option key={apt.aptID} value={apt.aptID}>
//                   {apt.aptID}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Appointment Details */}
//           {appointmentDetails && (
//             <div className="mb-8">
//               <div className="bg-white border border-gray-300 rounded-xl shadow-xl overflow-hidden">
//                 <div className="p-6">
//                   <h2 className="text-3xl font-extrabold text-teal-700 mb-5">
//                     Appointment Details
//                   </h2>
//                   <ul className="space-y-4 text-base text-gray-700">
//                     <li className="flex justify-between items-center">
//                       <span className="flex items-center font-medium text-teal-700">
//                         <FaUser className="text-teal-500 mr-2" /> Patient Name:
//                       </span>
//                       <span>{appointmentDetails.patient.name}</span>
//                     </li>
//                     <li className="flex justify-between items-center">
//                       <span className="flex items-center font-medium text-teal-700">
//                         <FaBirthdayCake className="text-teal-500 mr-2" /> Age:
//                       </span>
//                       <span>{appointmentDetails.patient.age}</span>
//                     </li>
//                     <li className="flex justify-between items-center">
//                       <span className="flex items-center font-medium text-teal-700">
//                         <FaVenusMars className="text-teal-500 mr-2" /> Gender:
//                       </span>
//                       <span>{appointmentDetails.patient.gender}</span>
//                     </li>
//                     <li className="flex justify-between items-center">
//                       <span className="flex items-center font-medium text-teal-700">
//                         <FaTooth className="text-teal-500 mr-2" /> Consulted
//                         Dentist:
//                       </span>
//                       <span>{appointmentDetails.dentist.name}</span>
//                     </li>
//                     <li className="flex justify-between items-center">
//                       <span className="flex items-center font-medium text-teal-700">
//                         <FaCalendarAlt className="text-teal-500 mr-2" /> Date:
//                       </span>
//                       <span>
//                         {new Date(
//                           appointmentDetails.appointment.date
//                         ).toLocaleDateString()}
//                       </span>
//                     </li>
//                     <li className="flex justify-between items-center">
//                       <span className="flex items-center font-medium text-teal-700">
//                         <FaClock className="text-teal-500 mr-2" /> Time:
//                       </span>
//                       <span>{appointmentDetails.appointment.time}</span>
//                     </li>
//                   </ul>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Invoice Form */}
//           <form onSubmit={handleInvoiceSubmit} className="space-y-6">
//             <div>
//               <label className="block text-sm font-medium text-teal-900 mb-1">
//                 Invoice Date
//               </label>
//               <input
//                 type="date"
//                 value={invoiceDetails.invoice_date}
//                 onChange={(e) =>
//                   setInvoiceDetails((prev) => ({
//                     ...prev,
//                     invoice_date: e.target.value,
//                   }))
//                 }
//                 className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-teal-900 mb-1">
//                 Payment Status
//               </label>
//               <select
//                 value={invoiceDetails.payment_status}
//                 onChange={(e) =>
//                   setInvoiceDetails((prev) => ({
//                     ...prev,
//                     payment_status: e.target.value === "true",
//                   }))
//                 }
//                 className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400"
//               >
//                 <option value="false">Unpaid</option>
//                 <option value="true">Paid</option>
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-teal-900 mb-2">
//                 Items
//               </label>
//               {invoiceDetails.items.map((item, index) => (
//                 <div key={index} className="flex space-x-4 mb-4">
//                   <input
//                     type="text"
//                     placeholder="Description"
//                     value={item.description}
//                     onChange={(e) => {
//                       const updatedItems = [...invoiceDetails.items];
//                       updatedItems[index].description = e.target.value;
//                       setInvoiceDetails((prev) => ({
//                         ...prev,
//                         items: updatedItems,
//                       }));
//                     }}
//                     className="w-2/3 p-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400"
//                     required
//                   />
//                   <input
//                     type="number"
//                     placeholder="Amount"
//                     value={item.amount}
//                     onChange={(e) => {
//                       const updatedItems = [...invoiceDetails.items];
//                       updatedItems[index].amount =
//                         parseFloat(e.target.value) || 0;
//                       setInvoiceDetails((prev) => ({
//                         ...prev,
//                         items: updatedItems,
//                       }));
//                     }}
//                     className="w-1/3 p-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400"
//                     required
//                   />
//                   <button
//                     type="button"
//                     onClick={() => handleRemoveItem(index)}
//                     className="text-red-500 hover:text-red-700 font-semibold"
//                   >
//                     Remove
//                   </button>
//                 </div>
//               ))}
//               <button
//                 type="button"
//                 onClick={handleAddItem}
//                 className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-4 rounded-xl shadow-md"
//               >
//                 Add Item
//               </button>
//             </div>

//             {error && <p className="text-red-600 text-sm">{error}</p>}

//             <div className="flex justify-between space-x-4 mt-6">
//               <button
//                 type="submit"
//                 className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3 rounded-xl shadow-md"
//               >
//                 {isEditing ? "Update Invoice" : "Create Invoice"}
//               </button>
//               <button
//                 type="button"
//                 onClick={handlePrint}
//                 className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3 rounded-xl shadow-md"
//               >
//                 Print Invoice
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Invoice;

import { useState, useEffect } from "react";
import axios from "axios";
import ReceptionNavbar from "./ReceptionNavbar";
import { toast } from "react-hot-toast";
import {
  FaUser,
  FaCalendarAlt,
  FaClock,
  FaTooth,
  FaVenusMars,
  FaTrash,
  FaBirthdayCake,
} from "react-icons/fa";

const Invoice = () => {
  const [aptID, setAptID] = useState("");
  const [searchAptID, setSearchAptID] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [appointmentDetails, setAppointmentDetails] = useState(null);
  const [invoiceDetails, setInvoiceDetails] = useState({
    invoice_date: new Date().toISOString().slice(0, 10), // Default to today's date
    payment_status: false,
    items: [],
  });
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");

  // Loading states
  const [loadingAppointments, setLoadingAppointments] = useState(false);
  const [loadingAppointmentDetails, setLoadingAppointmentDetails] =
    useState(false);
  const [loadingInvoice, setLoadingInvoice] = useState(false);
  const [submittingInvoice, setSubmittingInvoice] = useState(false);

  // Use refs to store toast IDs
  const toastIds = {
    fetchAppointments: "fetchAppointmentsToast",
    fetchAppointmentDetails: "fetchAppointmentDetailsToast",
    fetchInvoice: "fetchInvoiceToast",
    submitInvoice: "submitInvoiceToast",
  };

  // Fetch all appointments on mount
  useEffect(() => {
    const fetchAppointments = async () => {
      setLoadingAppointments(true);

      // Dismiss previous toast with this ID (if any)
      toast.dismiss(toastIds.fetchAppointments);

      // Show loading toast with fixed ID
      toast.loading("Fetching appointments...", {
        id: toastIds.fetchAppointments,
      });

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}appointments/getAllAppointments`
        );
        setAppointments(response.data.appointment || []);
        toast.success("Appointments loaded", {
          id: toastIds.fetchAppointments,
        });
      } catch (error) {
        console.error("Failed to fetch appointments:", error);
        toast.error("Failed to load appointments", {
          id: toastIds.fetchAppointments,
        });
      } finally {
        setLoadingAppointments(false);
      }
    };

    fetchAppointments();
  }, []);

  // Fetch appointment details when searchAptID changes
  useEffect(() => {
    const fetchAppointmentDetails = async () => {
      if (!searchAptID) {
        setAppointmentDetails(null);
        return;
      }

      setLoadingAppointmentDetails(true);

      toast.dismiss(toastIds.fetchAppointmentDetails);
      toast.loading("Loading appointment details...", {
        id: toastIds.fetchAppointmentDetails,
      });

      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_API_BASE_URL
          }appointments/details/${searchAptID}`
        );
        setAppointmentDetails(response.data.details);
        toast.success("Appointment details loaded", {
          id: toastIds.fetchAppointmentDetails,
        });
      } catch (error) {
        console.error("Failed to fetch appointment details:", error);
        setAppointmentDetails(null);
        toast.error("Unable to load appointment details", {
          id: toastIds.fetchAppointmentDetails,
        });
      } finally {
        setLoadingAppointmentDetails(false);
      }
    };

    fetchAppointmentDetails();
  }, [searchAptID]);

  // Fetch invoice details
  const fetchInvoice = async () => {
    if (!searchAptID) return;

    toast.dismiss(toastIds.fetchInvoice);
    toast.loading("Fetching invoice...", { id: toastIds.fetchInvoice });

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}invoice/get`,
        { params: { aptID: searchAptID } }
      );

      const data = response?.data;

      if (data && Object.keys(data).length > 0) {
        setInvoiceDetails({
          ...data,
          invoice_date: data.invoice_date
            ? new Date(data.invoice_date).toISOString().slice(0, 10)
            : new Date().toISOString().slice(0, 10),
          items: Array.isArray(data.items) ? data.items : [],
          payment_status: !!data.payment_status,
        });
        setIsEditing(true);
        toast.success("Invoice loaded", { id: toastIds.fetchInvoice });
      } else {
        toast("No invoice found. Switching to create mode.", {
          id: toastIds.fetchInvoice,
        });
        setInvoiceDetails({
          invoice_date: new Date().toISOString().slice(0, 10),
          payment_status: false,
          items: [],
        });
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Failed to fetch invoice:", error);
      toast.error("Unable to fetch invoice. Switching to create mode.", {
        id: toastIds.fetchInvoice,
      });
      setInvoiceDetails({
        invoice_date: new Date().toISOString().slice(0, 10),
        payment_status: false,
        items: [],
      });
      setIsEditing(false);
    }
  };
  // Trigger fetchInvoice when searchAptID changes
  const handleInvoiceSubmit = async (e) => {
    e.preventDefault();

    if (!invoiceDetails.invoice_date || invoiceDetails.items.length === 0) {
      setError("All fields are required.");
      return;
    }

    setError("");
    setSubmittingInvoice(true);

    toast.dismiss(toastIds.submitInvoice);
    toast.loading(isEditing ? "Updating invoice..." : "Creating invoice...", {
      id: toastIds.submitInvoice,
    });

    try {
      const endpoint = isEditing
        ? `${import.meta.env.VITE_API_BASE_URL}invoice/update`
        : `${import.meta.env.VITE_API_BASE_URL}invoice/create`;
      const method = isEditing ? "put" : "post";

      const response = await axios[method](endpoint, {
        aptID: searchAptID,
        ...invoiceDetails,
      });

      toast.success(response.data.message || "Invoice saved successfully!", {
        id: toastIds.submitInvoice,
      });
      fetchInvoice(); // Reload updated invoice
      setIsEditing(true);
      setError("");
    } catch (error) {
      console.error("Failed to save invoice:", error);
      toast.error("Failed to save invoice. Please try again.", {
        id: toastIds.submitInvoice,
      });
    } finally {
      setSubmittingInvoice(false);
    }
  };

  useEffect(() => {
    if (searchAptID) {
      fetchInvoice();
    }
  }, [searchAptID]);

  const Spinner = () => (
    <svg
      className="animate-spin h-5 w-5 text-white inline-block ml-2"
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
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  );

  const handleAddItem = () => {
    setInvoiceDetails((prev) => ({
      ...prev,
      items: [...prev.items, { description: "", amount: 0 }],
    }));
  };

  const handleRemoveItem = (index) => {
    setInvoiceDetails((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handlePrint = () => {
    if (!invoiceDetails || !appointmentDetails) {
      toast.error("No complete details available to print.");
      return;
    }

    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice - Appointment ID: ${searchAptID}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
              color: #333;
            }
            .container {
              width: 80%;
              margin: 0 auto;
              padding: 20px;
              border: 1px solid #ddd;
              border-radius: 10px;
              background-color: #fff;
            }
            h1, h2 {
              text-align: center;
              color: #007bff;
            }
            .section {
              margin-bottom: 20px;
            }
            .section ul {
              list-style-type: none;
              padding: 0;
            }
            .section li {
              margin-bottom: 10px;
            }
            .section li span {
              font-weight: bold;
            }
            .table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            .table th, .table td {
              padding: 8px;
              border: 1px solid #ddd;
              text-align: left;
            }
            .total {
              font-size: 18px;
              font-weight: bold;
              text-align: right;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Invoice - Appointment ID: ${searchAptID}</h1>
            
            <!-- Appointment Details -->
            <div class="section">
              <h2>Appointment Details</h2>
              <ul>
                <li><span>Appointment ID:</span> ${
                  appointmentDetails.appointment.aptID
                }</li>
                <li><span>Date:</span> ${new Date(
                  appointmentDetails.appointment.date
                ).toLocaleDateString()}</li>
                <li><span>Time:</span> ${
                  appointmentDetails.appointment.time
                }</li>
              </ul>
            </div>
  
            <!-- Patient Details -->
            <div class="section">
              <h2>Patient Details</h2>
              <ul>
                <li><span>Name:</span> ${appointmentDetails.patient.name}</li>
                <li><span>Age:</span> ${appointmentDetails.patient.age}</li>
                <li><span>Gender:</span> ${
                  appointmentDetails.patient.gender
                }</li>
              </ul>
            </div>
  
            <!-- Dentist Details -->
            <div class="section">
              <h2>Dentist Details</h2>
              <ul>
                <li><span>Name:</span> ${appointmentDetails.dentist.name}</li>
                <li><span>Specialization:</span> ${
                  appointmentDetails.dentist.specialization
                }</li>
              </ul>
            </div>
  
            <!-- Invoice Details -->
            <div class="section">
              <h2>Invoice Details</h2>
              <p><span>Invoice Date:</span> ${new Date(
                invoiceDetails.invoice_date
              ).toLocaleDateString()}</p>
              <p><span>Payment Status:</span> ${
                invoiceDetails.payment_status ? "Paid" : "Unpaid"
              }</p>
  
              <!-- Items -->
              <table class="table">
                <thead>
                  <tr>
                    <th>Description</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  ${invoiceDetails.items
                    .map(
                      (item) =>
                        `<tr><td>${
                          item.description
                        }</td><td>$${item.amount.toFixed(2)}</td></tr>`
                    )
                    .join("")}
                </tbody>
              </table>
  
              <!-- Total Amount -->
              <p class="total">Total Amount: $${invoiceDetails.items
                .reduce((sum, item) => sum + item.amount, 0)
                .toFixed(2)}</p>
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-100">
      <ReceptionNavbar />
      <div className="flex justify-center items-start pt-10 px-5">
        <div className="w-full max-w-4xl bg-white p-8 rounded-2xl shadow-2xl border border-gray-300">
          <h1 className="text-3xl font-extrabold text-teal-700 mb-6">
            Invoice
          </h1>

          {/* Appointment Selector */}
          <div className="mb-6">
            <label
              htmlFor="appointment"
              className="block text-sm font-semibold text-teal-900 mb-1"
            >
              Appointment ID
            </label>
            <select
              id="appointment"
              className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400"
              value={aptID}
              onChange={(e) => {
                setAptID(e.target.value);
                setSearchAptID(e.target.value);
              }}
              disabled={loadingAppointments}
            >
              <option value="">Select Appointment ID</option>
              {appointments.map((apt) => (
                <option key={apt.aptID} value={apt.aptID}>
                  {apt.aptID}
                </option>
              ))}
            </select>
            {loadingAppointments && (
              <p className="text-teal-600 mt-2 flex items-center gap-2">
                Loading appointments <Spinner />
              </p>
            )}
          </div>

          {/* Appointment Details */}
          {loadingAppointmentDetails ? (
            <p className="text-center text-teal-600 mb-8 flex justify-center items-center gap-2">
              Loading appointment details <Spinner />
            </p>
          ) : (
            appointmentDetails && (
              <div className="mb-8">
                <div className="bg-white border border-gray-300 rounded-xl shadow-xl overflow-hidden">
                  <div className="p-6">
                    <h2 className="text-3xl font-extrabold text-teal-700 mb-5">
                      Appointment Details
                    </h2>
                    <ul className="space-y-4 text-base text-gray-700">
                      <li className="flex justify-between items-center">
                        <span className="flex items-center font-medium text-teal-700">
                          <FaUser className="text-teal-500 mr-2" /> Patient
                          Name:
                        </span>
                        <span>{appointmentDetails.patient.name}</span>
                      </li>
                      <li className="flex justify-between items-center">
                        <span className="flex items-center font-medium text-teal-700">
                          <FaBirthdayCake className="text-teal-500 mr-2" /> Age:
                        </span>
                        <span>{appointmentDetails.patient.age}</span>
                      </li>
                      <li className="flex justify-between items-center">
                        <span className="flex items-center font-medium text-teal-700">
                          <FaVenusMars className="text-teal-500 mr-2" /> Gender:
                        </span>
                        <span>{appointmentDetails.patient.gender}</span>
                      </li>
                      <li className="flex justify-between items-center">
                        <span className="flex items-center font-medium text-teal-700">
                          <FaTooth className="text-teal-500 mr-2" /> Consulted
                          Dentist:
                        </span>
                        <span>{appointmentDetails.dentist.name}</span>
                      </li>
                      <li className="flex justify-between items-center">
                        <span className="flex items-center font-medium text-teal-700">
                          <FaCalendarAlt className="text-teal-500 mr-2" /> Date:
                        </span>
                        <span>
                          {new Date(
                            appointmentDetails.appointment.date
                          ).toLocaleDateString()}
                        </span>
                      </li>
                      <li className="flex justify-between items-center">
                        <span className="flex items-center font-medium text-teal-700">
                          <FaClock className="text-teal-500 mr-2" /> Time:
                        </span>
                        <span>{appointmentDetails.appointment.time}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )
          )}

          {/* Invoice Form */}
          <form onSubmit={handleInvoiceSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-teal-900 mb-1">
                Invoice Date
              </label>
              <input
                type="date"
                value={invoiceDetails.invoice_date}
                onChange={(e) =>
                  setInvoiceDetails((prev) => ({
                    ...prev,
                    invoice_date: e.target.value,
                  }))
                }
                required
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-teal-900 mb-1">
                Payment Status
              </label>
              <select
                value={invoiceDetails.payment_status ? "paid" : "unpaid"}
                onChange={(e) =>
                  setInvoiceDetails((prev) => ({
                    ...prev,
                    payment_status: e.target.value === "paid",
                  }))
                }
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400"
              >
                <option value="unpaid">Unpaid</option>
                <option value="paid">Paid</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-teal-900 mb-1">
                Invoice Items
              </label>
              {invoiceDetails.items.length === 0 && (
                <p className="text-gray-500 mb-3">No items added yet.</p>
              )}

              {invoiceDetails.items.map((item, index) => (
                <div key={index} className="flex space-x-2 mb-3 items-center">
                  <input
                    type="text"
                    placeholder="Description"
                    value={item.description}
                    onChange={(e) => {
                      const newItems = [...invoiceDetails.items];
                      newItems[index].description = e.target.value;
                      setInvoiceDetails((prev) => ({
                        ...prev,
                        items: newItems,
                      }));
                    }}
                    className="flex-grow p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400"
                    required
                  />
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Amount"
                    value={item.amount}
                    onChange={(e) => {
                      const newItems = [...invoiceDetails.items];
                      newItems[index].amount = parseFloat(e.target.value) || 0;
                      setInvoiceDetails((prev) => ({
                        ...prev,
                        items: newItems,
                      }));
                    }}
                    className="w-24 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(index)}
                    className="text-red-600 hover:text-red-800"
                    aria-label="Delete item"
                  >
                    <FaTrash className="w-5 h-5" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddItem}
                className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-4 rounded-xl shadow-md"
              >
                Add Item
              </button>
            </div>

            {error && <p className="text-red-600 font-semibold">{error}</p>}

            <button
              type="submit"
              disabled={submittingInvoice}
              className={`w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3 rounded-xl shadow-md flex justify-center items-center ${
                submittingInvoice ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {submittingInvoice ? (
                <>
                  {isEditing ? "Updating" : "Creating"}
                  <Spinner />
                </>
              ) : isEditing ? (
                "Update Invoice"
              ) : (
                "Create Invoice"
              )}
            </button>
          </form>

          <button
            type="button"
            disabled={loadingInvoice || submittingInvoice}
            onClick={handlePrint}
            className={`mt-6 w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3 rounded-xl shadow-md ${
              loadingInvoice || submittingInvoice
                ? "opacity-70 cursor-not-allowed"
                : ""
            }`}
          >
            Print Invoice
          </button>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
