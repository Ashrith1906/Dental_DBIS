const Invoice = require('../models/invoiceModel');
const Appointment = require('../models/appointmentModel'); // Import the Appointment model

// Create a new invoice if the appointment exists
exports.createInvoice = async (req, res) => {
  try {
    const { aptID, invoice_date, total_amt, payment_status } = req.body;

    // Check if the appointment exists
    const appointment = await Appointment.findOne({ aptID });
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Create the invoice if the appointment exists
    const newInvoice = new Invoice({ aptID, invoice_date, total_amt, payment_status });
    const savedInvoice = await newInvoice.save();
    res.status(201).json(savedInvoice);
  } catch (err) {
    res.status(400).json({ message: 'Error creating invoice', error: err.message });
  }
};

// Get an invoice by ID
exports.getInvoiceById = async (req, res) => {
  try {
    const { aptID } = req.query;

    // Find the invoice by ID
    const invoice = await Invoice.find({aptID:aptID});
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    res.status(200).json(invoice);
  } catch (err) {
    res.status(400).json({ message: 'Error fetching invoice', error: err.message });
  }
};

// Update an invoice by ID
exports.updateInvoice = async (req, res) => {
  try {

    const {aptID, invoice_date, total_amt, payment_status } = req.body;

    // Find and update the invoice by ID
    const updatedInvoice = await Invoice.findByIdAndUpdate(
      id,
      { invoice_date, total_amt, payment_status },
      { new: true, runValidators: true } // Return the updated document
    );

    if (!updatedInvoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    res.status(200).json(updatedInvoice);
  } catch (err) {
    res.status(400).json({ message: 'Error updating invoice', error: err.message });
  }
};
