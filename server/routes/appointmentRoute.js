const express = require("express");
const router = express.Router();

const {createAppointment,createDentistSchedule, getDentistSchedule, getDentistIdByPatientId,getAvailableSlotsByDentistId }=require('../controllers/appointmentController');

router.post("/create", createAppointment);

// Route to create or update a dentist's schedule
router.post('/schedule', createDentistSchedule);

router.get('/dentist/:pID', getDentistIdByPatientId);
router.get('/:dentistId/available-slots/:date', getAvailableSlotsByDentistId)
// Route to get a dentist's schedule by dentistId
router.get('/schedule/:dentistId', getDentistSchedule);

module.exports = router;