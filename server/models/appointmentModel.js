const mongoose = require('mongoose');

// Helper function to generate the next appointment ID (aptID)
async function generateNextAppointmentId() {
  try {
    // Find the appointment with the highest aptID
    const latestAppointment = await mongoose.model('Appointment').findOne()
      .sort({ aptID: -1 }) // Sort by aptID in descending order
      .select('aptID'); // Only return aptID field

    // If there are existing appointments
    if (latestAppointment && latestAppointment.aptID) {
      const latestId = latestAppointment.aptID;

      // Check if the ID format is correct (should start with 'a' followed by 3 digits)
      if (/^a\d{3}$/.test(latestId)) {
        const numericPart = parseInt(latestId.slice(1), 10); // Extract numeric part from aptID
        const nextId = 'a' + String(numericPart + 1).padStart(3, '0'); // Increment and pad to 3 digits
        console.log(`Generated next aptID: ${nextId}`);
        return nextId;
      } else {
        // If the format is invalid, reset to starting ID 'a001'
        console.log(`Invalid aptID format in existing data, starting from a001`);
        return 'a001';
      }
    } else {
      // If no appointments exist, start with a001
      console.log('Starting aptID sequence');
      return 'a001';
    }
  } catch (error) {
    console.error('Error generating aptID:', error.message);
    throw error;
  }
}

const appointmentSchema = new mongoose.Schema({
  pID: {
    type: String,  // Reference to Patient's pID
    required: true
  },
  dentistId: {
    type: String,
  },
  aptID: {
    type: String,  // This will store appointment ID like "a001"
  },
  apt_date: {
    type: Date,
    // required: true
  },
  apt_time: {
    type: String,  // Store time in HH:MM format
    // required: true
  },
  reason: {
    type: String,
    // required: true
  },
  status: {
    type: String,
    // required: true
  }
});

// Pre-save hook to generate the next aptID based on existing data
appointmentSchema.pre('save', async function(next) {
  if (this.isNew) {
    try {
      // Generate a sequential appointment ID (aptID) based on existing data
      this.aptID = await generateNextAppointmentId();
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;
