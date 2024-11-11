const express = require("express");
const router = express.Router();

const {createAppointment,createDentistSchedule, getDentistSchedule }=require('../controllers/appointmentController');

router.post("/create", createAppointment);

// Route to create or update a dentist's schedule
router.post('/schedule', createDentistSchedule);

// Route to get a dentist's schedule by dentistId
router.get('/:dentistId', getDentistSchedule);

module.exports = router;