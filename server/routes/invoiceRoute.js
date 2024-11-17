const express = require("express");
const router = express.Router();
const {
  createInvoice,
  getInvoiceById,
  updateInvoice
} = require('../controllers/invoiceController');

// Create a new invoice
router.post("/create", createInvoice);

router.get('/get', getInvoiceById);

router.put('/update', updateInvoice)

module.exports = router;