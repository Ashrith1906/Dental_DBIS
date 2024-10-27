const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  aptID: {
    type: Number,
    required: true,
    unique: true
  },
  apt_date: {
    type: Date,
    required: true
  },
  apt_time: {
    type: String,  // You can also use Date type with only time, or a custom time validator
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  }
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;