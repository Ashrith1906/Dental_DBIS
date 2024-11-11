const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dentistScheduleSchema = new Schema({
  dentistId: {
    type: String,
    required: true
  },
  availableTime: {
    type: [String], // Array of available time slots as strings (e.g., ["10:00", "10:30", "11:00"])
    required: true
  }
});

const DentistSchedule = mongoose.model('DentistSchedule', dentistScheduleSchema);

module.exports = DentistSchedule;