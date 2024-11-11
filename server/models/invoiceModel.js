const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  aptID: {
    type: String,
    required: true,
    unique: true
  },
  invoice_date: {
    type: Date,
    required: true
  },
  total_amt: {
    type: Number,
    required: true
  },
  payment_status: {
    type: Boolean,
    required: true
  }
});

const Invoice = mongoose.model('Invoice', invoiceSchema);

module.exports = Invoice;