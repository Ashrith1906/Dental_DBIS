import React, { useState, useEffect } from "react";
import axios from "axios";
import ReceptionNavbar from "./ReceptionNavbar";

const Invoice = () => {
  const [aptID, setAptID] = useState(""); // Store appointment ID
  const [patientDetails, setPatientDetails] = useState({
    name: "Loading...",
    age: "Loading...",
    gender: "Loading...",
    phone_no: "Loading...",
  }); // Store patient details
  const [dentistDetails, setDentistDetails] = useState({
    name: "Loading...",
    specialization: "Loading...",
  }); // Store dentist details
  const [appointmentDetails, setAppointmentDetails] = useState({
    date: "Loading...",
    time: "Loading...",
    reason: "Loading...",
  }); // Store appointment details
  const [invoiceDetails, setInvoiceDetails] = useState({
    items: [{ description: "", amount: "" }],
    payment_status: false,
  }); // Store invoice details
  const [invoiceID, setInvoiceID] = useState(""); // Store the generated invoice ID
  const [isEditing, setIsEditing] = useState(false); // Toggle for editing the invoice

  // Fetch appointment and related details by aptID
  useEffect(() => {
    const fetchDetails = async () => {
      if (!aptID) return; // Prevent unnecessary calls

      try {
        const response = await axios.get(
          `http://localhost:3000/api/appointments/details/${aptID}`
        );
        const { details } = response.data;

        setPatientDetails(details.patient || {
          name: "Not Available",
          age: "Not Available",
          gender: "Not Available",
          phone_no: "Not Available",
        });
        setDentistDetails(details.dentist || {
          name: "Not Available",
          specialization: "Not Available",
        });
        setAppointmentDetails(details.appointment || {
          date: "Not Available",
          time: "Not Available",
          reason: "Not Available",
        });
      } catch (error) {
        console.error("Failed to fetch appointment details:", error);
        alert("Unable to fetch appointment details. Please try again.");
      }
    };

    fetchDetails();
  }, [aptID]);

  // Handle input change for invoice items (description and amount)
  const handleInvoiceChange = (e, index) => {
    const updatedItems = [...invoiceDetails.items];
    updatedItems[index][e.target.name] = e.target.value;
    setInvoiceDetails({ ...invoiceDetails, items: updatedItems });
  };

  // Add a new invoice item
  const handleAddItem = () => {
    setInvoiceDetails({
      ...invoiceDetails,
      items: [...invoiceDetails.items, { description: "", amount: "" }],
    });
  };

  // Remove an invoice item
  const handleRemoveItem = (index) => {
    const updatedItems = invoiceDetails.items.filter((_, i) => i !== index);
    setInvoiceDetails({ ...invoiceDetails, items: updatedItems });
  };

  // Toggle between editing and viewing modes
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  // Submit the invoice data to the backend
  const handleInvoiceSubmit = async (e) => {
    e.preventDefault();

    const invoiceData = {
      aptID,
      invoice_date: new Date(),
      payment_status: invoiceDetails.payment_status,
      items: invoiceDetails.items,
    };

    try {
      console.log(invoiceData);
      const response = await axios.post("http://localhost:3000/api/invoice/create", invoiceData);
      if (response.data.invoiceID) {
        setInvoiceID(response.data.invoiceID); // Set the generated invoice ID
        alert("Invoice saved successfully!");
        setIsEditing(false); // Disable editing after submission
      }
    } catch (error) {
      console.error("Failed to save invoice:", error);
      alert("Failed to save invoice. Please try again.");
    }
  };

  // Print function that opens a new tab with the invoice content
  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice - ${invoiceID}</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 20px; background-color: #f1f5f9; color: #333; }
            h1 { color: #005eb8; }
            .section { margin-bottom: 20px; }
            .section strong { color: #333; }
            .section p { margin: 4px 0; }
          </style>
        </head>
        <body>
          <h1>Patient Invoice</h1>
          <div class="section">
            <h2>Invoice ID</h2>
            <p><strong>Invoice ID:</strong> ${invoiceID}</p>
          </div>
          <div class="section">
            <h2>Appointment Details</h2>
            <p><strong>Appointment ID:</strong> ${aptID}</p>
            <p><strong>Date:</strong> ${appointmentDetails.date}</p>
            <p><strong>Time:</strong> ${appointmentDetails.time}</p>
            <p><strong>Reason for Appointment:</strong> ${appointmentDetails.reason}</p>
          </div>
          <div class="section">
            <h2>Patient Details</h2>
            <p><strong>Name:</strong> ${patientDetails.name}</p>
            <p><strong>Age:</strong> ${patientDetails.age}</p>
            <p><strong>Gender:</strong> ${patientDetails.gender}</p>
            <p><strong>Phone:</strong> ${patientDetails.phone_no}</p>
          </div>
          <div class="section">
            <h2>Dentist Details</h2>
            <p><strong>Dentist Name:</strong> ${dentistDetails.name}</p>
            <p><strong>Specialization:</strong> ${dentistDetails.specialization}</p>
          </div>
          <div class="section">
            <h2>Invoice Details</h2>
            ${invoiceDetails.items
              .map(
                (item, index) => `
                  <p><strong>Description:</strong> ${item.description}</p>
                  <p><strong>Amount:</strong> ${item.amount}</p>
                `
              )
              .join("")}
            <p><strong>Payment Status:</strong> ${invoiceDetails.payment_status ? "Paid" : "Pending"}</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div>
      <ReceptionNavbar />

      <div className="bg-gray-50 min-h-screen flex flex-col items-center py-8">
        <div className="bg-white p-8 shadow-lg rounded-lg w-full max-w-3xl">
          <h1 className="text-3xl font-semibold text-teal-700 mb-6">Invoice</h1>

          {/* Appointment ID and Details */}
          <div className="mb-6 bg-teal-50 p-4 rounded-lg shadow-sm">
            <div className="flex items-center space-x-4">
              <label htmlFor="aptID" className="font-medium text-teal-700 text-lg">
                Appointment ID:
              </label>
              <input
                type="text"
                id="aptID"
                value={aptID}
                onChange={(e) => setAptID(e.target.value)}
                className="p-2 border border-teal-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Enter Appointment ID"
              />
            </div>

            {aptID && (
              <div className="mt-4 space-y-2">
                <p>
                  <strong>Date:</strong> {appointmentDetails.date}
                </p>
                <p>
                  <strong>Time:</strong> {appointmentDetails.time}
                </p>
                <p>
                  <strong>Reason for Appointment:</strong>{" "}
                  {appointmentDetails.reason}
                </p>
              </div>
            )}
          </div>

          {/* Patient Details */}
          {aptID && (
            <div className="mb-6 bg-teal-50 p-4 rounded-lg shadow-sm">
              <div className="space-y-2">
                <p>
                  <strong>Name:</strong> {patientDetails.name}
                </p>
                <p>
                  <strong>Age:</strong> {patientDetails.age}
                </p>
                <p>
                  <strong>Gender:</strong> {patientDetails.gender}
                </p>
                <p>
                  <strong>Phone:</strong> {patientDetails.phone_no}
                </p>
              </div>
            </div>
          )}

          {/* Dentist Details */}
          {aptID && (
            <div className="mb-6 bg-teal-50 p-4 rounded-lg shadow-sm">
              <div className="space-y-2">
                <p>
                  <strong>Dentist Name:</strong> {dentistDetails.name}
                </p>
                <p>
                  <strong>Specialization:</strong> {dentistDetails.specialization}
                </p>
              </div>
            </div>
          )}

          {/* Invoice Items */}
          <form onSubmit={handleInvoiceSubmit}>
            {invoiceDetails.items.map((item, index) => (
              <div key={index} className="mb-4 bg-teal-50 p-4 rounded-lg shadow-sm">
                <div className="space-y-2">
                  <div className="flex items-center space-x-4">
                    <input
                      type="text"
                      name="description"
                      value={item.description}
                      onChange={(e) => handleInvoiceChange(e, index)}
                      placeholder="Item Description"
                      className="p-2 border border-teal-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div className="flex items-center space-x-4 mt-2">
                    <input
                      type="number"
                      name="amount"
                      value={item.amount}
                      onChange={(e) => handleInvoiceChange(e, index)}
                      placeholder="Amount"
                      className="p-2 border border-teal-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>
                <div className="mt-2">
                  {invoiceDetails.items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(index)}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                      Remove Item
                    </button>
                  )}
                </div>
              </div>
            ))}
            <div className="mb-4">
              <button
                type="button"
                onClick={handleAddItem}
                className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
              >
                Add Item
              </button>
            </div>

            {/* Payment Status */}
            <div className="mb-4">
              <label className="font-medium text-teal-700">
                Payment Status:
              </label>
              <select
                value={invoiceDetails.payment_status}
                onChange={(e) => setInvoiceDetails({ ...invoiceDetails, payment_status: e.target.value })}
                className="p-2 border border-teal-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value={false}>Pending</option>
                <option value={true}>Paid</option>
              </select>
            </div>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={handleEditToggle}
                className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600"
              >
                {isEditing ? "Cancel Editing" : "Edit Invoice"}
              </button>

              {isEditing && (
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
                >
                  Save Invoice
                </button>
              )}

              {!isEditing && (
                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
                >
                  Print Invoice
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Invoice;







// import React, { useState } from "react";
// import axios from "axios";
// import ReceptionNavbar from "./ReceptionNavbar"; // Assuming you have this component

// const Invoice = () => {
//   const [aptID, setAptID] = useState(""); // Store appointment ID
//   const [invoiceID, setInvoiceID] = useState(""); // Store generated Invoice ID
//   const [invoiceDetails, setInvoiceDetails] = useState({
//     invoice_date: new Date().toISOString().split("T")[0], // Set today's date by default
//     payment_status: false,
//     items: [{ description: "", amount: "" }],
//   });

//   // Handle input change for items (description and amount)
//   const handleItemChange = (index, e) => {
//     const newItems = [...invoiceDetails.items];
//     newItems[index][e.target.name] = e.target.value;
//     setInvoiceDetails({ ...invoiceDetails, items: newItems });
//   };

//   // Add new item row for description and amount
//   const addItem = () => {
//     setInvoiceDetails({
//       ...invoiceDetails,
//       items: [...invoiceDetails.items, { description: "", amount: "" }],
//     });
//   };

//   // Remove an item row
//   const removeItem = (index) => {
//     const newItems = invoiceDetails.items.filter((_, i) => i !== index);
//     setInvoiceDetails({ ...invoiceDetails, items: newItems });
//   };

//   // Handle invoice form submission
//   const handleInvoiceSubmit = async (e) => {
//     e.preventDefault();

//     const invoiceData = {
//       aptID,
//       invoice_date: invoiceDetails.invoice_date,
//       payment_status: invoiceDetails.payment_status,
//       items: invoiceDetails.items,
//     };

//     try {
//       const response = await axios.post("http://localhost:3000/api/invoice/create", invoiceData);
//       if (response.data.invoiceID) {
//         setInvoiceID(response.data.invoiceID); // Store the generated invoiceID
//         alert("Invoice saved successfully!");
//       }
//     } catch (error) {
//       console.error("Failed to save invoice:", error);
//       alert("Failed to save invoice. Please try again.");
//     }
//   };

//   return (
//     <div>
//       <ReceptionNavbar /> {/* Assuming you have this component */}

//       <div className="bg-gray-50 min-h-screen flex flex-col items-center py-8">
//         <div className="bg-white p-8 shadow-lg rounded-lg w-full max-w-3xl">
//           <h1 className="text-3xl font-semibold text-teal-700 mb-6">Create Invoice</h1>

//           {/* Appointment ID and Invoice Details */}
//           <div className="mb-6 bg-teal-50 p-4 rounded-lg shadow-sm">
//             <div className="flex items-center space-x-4">
//               <label htmlFor="aptID" className="font-medium text-teal-700 text-lg">
//                 Appointment ID:
//               </label>
//               <input
//                 type="text"
//                 id="aptID"
//                 value={aptID}
//                 onChange={(e) => setAptID(e.target.value)}
//                 className="p-2 border border-teal-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
//                 placeholder="Enter Appointment ID"
//               />
//             </div>
//           </div>

//           {/* Items Details */}
//           <form onSubmit={handleInvoiceSubmit} className="space-y-6">
//             <div>
//               {invoiceDetails.items.map((item, index) => (
//                 <div key={index} className="flex space-x-4 mb-4">
//                   <input
//                     type="text"
//                     name="description"
//                     value={item.description}
//                     onChange={(e) => handleItemChange(index, e)}
//                     placeholder="Item description"
//                     className="p-3 border border-teal-300 rounded-md w-full"
//                   />
//                   <input
//                     type="number"
//                     name="amount"
//                     value={item.amount}
//                     onChange={(e) => handleItemChange(index, e)}
//                     placeholder="Amount"
//                     className="p-3 border border-teal-300 rounded-md w-full"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => removeItem(index)}
//                     className="bg-red-600 text-white p-3 rounded-md"
//                   >
//                     Remove
//                   </button>
//                 </div>
//               ))}

//               <button
//                 type="button"
//                 onClick={addItem}
//                 className="bg-teal-600 text-white p-3 rounded-md mb-4"
//               >
//                 Add Item
//               </button>
//             </div>

//             {/* Payment Status */}
//             <div className="mb-4">
//               <label className="block text-teal-700 text-lg">Payment Status</label>
//               <select
//                 value={invoiceDetails.payment_status}
//                 onChange={(e) => setInvoiceDetails({ ...invoiceDetails, payment_status: e.target.value })}
//                 className="p-3 border border-teal-300 rounded-md w-full"
//               >
//                 <option value={false}>Unpaid</option>
//                 <option value={true}>Paid</option>
//               </select>
//             </div>

//             {/* Submit Button */}
//             <div className="flex items-center space-x-4">
//               <button
//                 type="submit"
//                 className="bg-teal-600 text-white p-3 rounded-md hover:bg-teal-700"
//               >
//                 Save Invoice
//               </button>
//             </div>
//           </form>

//           {/* Display Invoice ID if saved */}
//           {invoiceID && (
//             <div className="mt-6 p-4 bg-teal-50 rounded-md">
//               <strong>Invoice ID:</strong> {invoiceID}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Invoice;
