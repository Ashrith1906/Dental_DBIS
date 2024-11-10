// server/models/patientModel.js
const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  pID: {
    type: String,  // Store pID as a string to include the prefix
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
  dentistId: {
    type: String,  // Using a string for dentistId like "d004"
    required: true
  }
});
// Helper function to generate the next sequential pID
async function generateNextPatientId() {
  try {
    // Find the patient with the highest pID
    const latestPatient = await mongoose.model('Patient').findOne()
      .sort({ pID: -1 }) // Sort descending by pID
      .select('pID'); // Only return pID field

    // If there are existing patients
    if (latestPatient && latestPatient.pID) {
      const latestId = latestPatient.pID;
      // Check if the ID format is correct (should start with 'p' followed by numbers)
      if (/^p\d{3}$/.test(latestId)) {
        const numericPart = parseInt(latestId.slice(1), 10); // Extract numeric part from pID
        const nextId = 'p' + String(numericPart + 1).padStart(3, '0'); // Increment and pad to 3 digits
        console.log(`Generated next pID: ${nextId}`);
        return nextId;
      } else {
        throw new Error('Invalid pID format in existing data');
      }
    } else {
      // Start sequence if no patients exist
      console.log('Starting pID sequence');
      return 'p001'; // First patient
    }
  } catch (error) {
    console.error('Error generating pID:', error.message);
    throw error;
  }
}

// Pre-save hook to generate the pID before saving the patient
patientSchema.pre('save', async function(next) {
  if (this.isNew) {
    try {
      // Generate a sequential pID
      this.pID = await generateNextPatientId();
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
