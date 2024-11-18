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
  deleteAppointmentByAptID
} = require("../controllers/appointmentController");


router.post("/create", createAppointment);

router.post("/schedule", createDentistSchedule);

router.get("/dentist/:pID", getDentistIdByPatientId);

router.get("/:dentistId/available-slots/:date", getAvailableSlotsByDentistId);

router.get("/schedule", getDentistSchedule);

router.get("/details/:aptID", getAppointmentDetailsByAptID);

router.get("/getAllAppointmentsByDentistId", getAllAppointmentsByDentistId);

router.get("/getAllAppointmentsByPID", getAllAppointmentsByPID);

router.get("/getAllAppointments", getAllAppointments);

router.get('/deleteAppointmentByAptID',deleteAppointmentByAptID)

module.exports = router;
