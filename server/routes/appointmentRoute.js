const express = require("express");
const router = express.Router();

const {createAppointment,selectDate, selectTime,getAvailableTime,getDentistFreeSlots}=require('../controllers/appointmentController');

router.post("/create", createAppointment);

router.post("/selectDate",selectDate);

router.post("/selectTime",selectTime);

router.get("/getDentistFreeSlots",getDentistFreeSlots);

module.exports = router;