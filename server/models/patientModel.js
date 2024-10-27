const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  pID: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    maxlength: 100
  },
  dob: {
    type: Date,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  gender: {
    type: String,
    required: true,
    maxlength: 100
  },
  phone_no: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /\d{10}/.test(v); // Validate 10-digit phone number
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  past_history: {
    type: String,  // TEXT equivalent in MongoDB
    required: true
  },
  current_status: {
    type: String,  // TEXT equivalent in MongoDB
    required: true
  },
  address: {
    type: String,
    required: true,
    maxlength: 100
  }
});

const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;