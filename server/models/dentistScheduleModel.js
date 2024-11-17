const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dentistScheduleSchema = new Schema({
  dentistId: {
    type: String,
    required: true,
  },
  date: {
    type: String, // Format: YYYY-MM-DD
    required: true,
  },
  availableTime: {
    type: [String], // Array of 20-minute slots (e.g., ["10:00", "10:20", "10:40"])
    required: true,
  },
});

// Ensure each dentist can only have one schedule per day
dentistScheduleSchema.index({ dentistId: 1, date: 1 }, { unique: true });

const DentistSchedule = mongoose.model('DentistSchedule', dentistScheduleSchema);

module.exports = DentistSchedule;