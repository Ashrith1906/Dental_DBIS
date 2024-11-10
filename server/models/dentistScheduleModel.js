const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dentistScheduleSchema = new Schema({
  dentistId: {
    type: String, // Store dentistId as a string, e.g., "d004"
    required: true
  },
  availableTime: {
    type: [String], // Store multiple available times as an array of strings
    required: true
  }
});

const DentistSchedule = mongoose.model('DentistSchedule', dentistScheduleSchema);

module.exports = DentistSchedule;
