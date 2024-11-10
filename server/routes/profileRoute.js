// server/routes/profileRoute.js
const express = require('express');
const { createDentistProfile, createReceptionistProfile,createDentistSchedule } = require('../controllers/profileController');
const router = express.Router();

router.post('/dentist', createDentistProfile);

router.post('/createDentistSchedule',createDentistSchedule)

router.post('/receptionist', createReceptionistProfile);

module.exports = router;