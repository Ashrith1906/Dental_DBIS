import React, { useState, useEffect } from "react";
import axios from "axios";
import ReceptionNavbar from "./ReceptionNavbar";

const Invoice = () => {
  const [aptID, setAptID] = useState("");
  const [searchAptID, setSearchAptID] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [invoiceDetails, setInvoiceDetails] = useState({
    invoice_date: new Date().toISOString().slice(0, 10), // Default to today's date
    payment_status: false,
    items: [],
  });
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");

  // Fetch all appointments on component mount
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/appointments/getAllAppointments"
        );
        setAppointments(response.data.appointment || []);
      } catch (error) {
        console.error("Failed to fetch appointments:", error);
        alert("Unable to fetch appointments. Please try again.");
      }
    };

    fetchAppointments();
  }, []);

  // Fetch invoice details
  const fetchInvoice = async () => {
    if (!searchAptID) return;

    try {
      const response = await axios.get(
        `http://localhost:3000/api/invoice/get`,
        { params: { aptID: searchAptID } }
      );
      const { data } = response;
      if (data) {
        // Format the date correctly and populate the form
        setInvoiceDetails({
          ...data,
          invoice_date: data.invoice_date
            ? new Date(data.invoice_date).toISOString().slice(0, 10)
            : new Date().toISOString().slice(0, 10),
        });
        setIsEditing(true);
      } else {
        // No invoice found, switch to create mode
        alert("No invoice found. Switching to create mode.");
        setInvoiceDetails({
          invoice_date: new Date().toISOString().slice(0, 10),
          payment_status: false,
          items: [],
        });
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Failed to fetch invoice:", error);
      alert("Unable to fetch invoice. Switching to create mode.");
      setInvoiceDetails({
        invoice_date: new Date().toISOString().slice(0, 10),
        payment_status: false,
        items: [],
      });
      setIsEditing(false);
    }
  };

  useEffect(() => {
    if (searchAptID) fetchInvoice();
  }, [searchAptID]);

  const handleInvoiceSubmit = async (e) => {
    e.preventDefault();

    if (!invoiceDetails.invoice_date || invoiceDetails.items.length === 0) {
      setError("All fields are required.");
      return;
    }

    try {
      const endpoint = isEditing
        ? "http://localhost:3000/api/invoice/update"
        : "http://localhost:3000/api/invoice/create";
      const method = isEditing ? "put" : "post";
      const response = await axios[method](endpoint, {
        aptID: searchAptID,
        ...invoiceDetails,
      });

      alert(response.data.message || "Invoice saved successfully!");
      fetchInvoice(); // Reload the updated invoice
      setIsEditing(true);
      setError("");
    } catch (error) {
      console.error("Failed to save invoice:", error);
      alert("Failed to save invoice. Please try again.");
    }
  };

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
    if (!invoiceDetails) {
      alert("No complete details available to print.");
      return;
    }

    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice - Appointment ID: ${searchAptID}</title>
          <style>
            /* Add your CSS here */
          </style>
        </head>
        <body>
          <h1>Invoice</h1>
          <p>Appointment ID: ${searchAptID}</p>
          <p>Invoice Date: ${new Date(invoiceDetails.invoice_date).toLocaleDateString()}</p>
          <p>Payment Status: ${invoiceDetails.payment_status ? "Paid" : "Unpaid"}</p>
          <ul>
            ${invoiceDetails.items
              .map(
                (item) =>
                  `<li>${item.description} - $${item.amount.toFixed(2)}</li>`
              )
              .join("")}
          </ul>
          <p>Total Amount: $${invoiceDetails.items.reduce(
            (sum, item) => sum + item.amount,
            0
          ).toFixed(2)}</p>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div>
      <ReceptionNavbar />
      <div className="flex justify-center items-center min-h-screen bg-white-100">
        <div className="w-full p-4 px-[30] mb-6 border border-gray-300 rounded-md shadow-md hover:shadow-xl transition-shadow duration-300 mx-5 my-1.5">
          <h1 className="text-3xl font-semibold text-teal-600 mb-6">Invoice</h1>

          <div className="mb-6">
            <label htmlFor="appointment" className="block text-teal-700 text-lg">
              Appointment ID
            </label>
            <select
              id="appointment"
              className="w-full mt-2 p-2 border border-gray-300 rounded-lg"
              value={aptID}
              onChange={(e) => {
                setAptID(e.target.value);
                setSearchAptID(e.target.value);
              }}
            >
              <option value="">Select Appointment ID</option>
              {appointments.map((apt) => (
                <option key={apt.aptID} value={apt.aptID}>
                  {apt.aptID}
                </option>
              ))}
            </select>
          </div>

          <form onSubmit={handleInvoiceSubmit} className="space-y-6">
            <div >
              <label className="block text-teal-700 text-lg">Invoice Date</label>
              <input
                type="date"
                value={invoiceDetails.invoice_date}
                onChange={(e) =>
                  setInvoiceDetails((prev) => ({
                    ...prev,
                    invoice_date: e.target.value,
                  }))
                }
                className="w-full p-3 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-teal-700 text-lg">Payment Status</label>
              <select
                value={invoiceDetails.payment_status}
                onChange={(e) =>
                  setInvoiceDetails((prev) => ({
                    ...prev,
                    payment_status: e.target.value === "true",
                  }))
                }
                className="w-full p-3 border rounded-lg"
              >
                <option value="false">Unpaid</option>
                <option value="true">Paid</option>
              </select>
            </div>
            <div>
              <label className="block text-teal-700 text-lg">Items</label>
              {invoiceDetails.items.map((item, index) => (
                <div key={index} className="flex space-x-4 mb-4">
                  <input
                    type="text"
                    placeholder="Description"
                    value={item.description}
                    onChange={(e) =>
                      setInvoiceDetails((prev) => {
                        const items = [...prev.items];
                        items[index].description = e.target.value;
                        return { ...prev, items };
                      })
                    }
                    className="w-2/3 p-2 border rounded-lg"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Amount"
                    value={item.amount}
                    onChange={(e) =>
                      setInvoiceDetails((prev) => {
                        const items = [...prev.items];
                        items[index].amount = parseFloat(e.target.value) || 0;
                        return { ...prev, items };
                      })
                    }
                    className="w-1/3 p-2 border rounded-lg"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(index)}
                    className="text-red-500"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddItem}
                className="bg-teal-600 text-white py-2 px-4 rounded-lg"
              >
                Add Item
              </button>
            </div>
            {error && <p className="text-red-600">{error}</p>}
            <div className="flex justify-between mt-6">
              <button
                type="submit"
                className="bg-teal-600 text-white py-2 px-6 rounded-lg"
              >
                {isEditing ? "Update Invoice" : "Create Invoice"}
              </button>
              <button
                type="button"
                onClick={handlePrint}
                className="bg-teal-600 text-white py-2 px-6 rounded-lg"
              >
                Print Invoice
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
