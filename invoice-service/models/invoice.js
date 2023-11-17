const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  recipientEmail: {
    type: String,
    required: true,
  },
  billAmount: {
    type: Number,
    required: true,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['paid', 'not paid'],
    default: 'not paid',
  },
});

const Invoice = mongoose.model('Invoice', invoiceSchema);

module.exports = Invoice;
