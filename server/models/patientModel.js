const mongoose = require('mongoose');
const Counter = require('./counterModel');  // Import the Counter model

const patientSchema = new mongoose.Schema({
  pID: {
    type: Number,
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
  },
  doctorId: {
    type: String,  // Using a string for doctorId like "d004"
    required: true
  }
});

// Pre-save hook to generate an auto-incremented pID
patientSchema.pre('save', async function(next) {
  if (this.isNew) {
    try {
      // Find the counter and increment its sequence
      const counter = await Counter.findOneAndUpdate(
        { name: 'patient' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      this.pID = counter.seq;  // Set the pID to the incremented sequence
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;
