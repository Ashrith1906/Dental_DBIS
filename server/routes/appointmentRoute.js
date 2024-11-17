const express = require("express");
const router = express.Router();

const {
  createAppointment,
  createDentistSchedule,
  getAllAppointmentsByPID,
  getAllAppointments,
  getDentistSchedule,
  getDentistIdByPatientId,
  getAllAppointmentsByDentistId,
  getAvailableSlotsByDentistId,
  getAppointmentDetailsByAptID,
} = require("../controllers/appointmentController");

router.post("/create", createAppointment);

// Route to create or update a dentist's schedule
router.post("/schedule", createDentistSchedule);

router.get("/dentist/:pID", getDentistIdByPatientId);

router.get("/:dentistId/available-slots/:date", getAvailableSlotsByDentistId);
// Route to get a dentist's schedule by dentistId
router.get("/schedule", getDentistSchedule);

// Route to get appointment details by aptID
router.get("/details/:aptID", getAppointmentDetailsByAptID);

router.get("/getAllAppointmentsByDentistId", getAllAppointmentsByDentistId);
router.get("/getAllAppointmentsByPID", getAllAppointmentsByPID);
router.get("/getAllAppointments", getAllAppointments);

module.exports = router;
