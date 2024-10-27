// server/routes/profileRoute.js
const express = require('express');
const { createDoctorProfile, createReceptionistProfile } = require('../controllers/profileController');
const router = express.Router();

router.post('/doctor', createDoctorProfile);

router.post('/receptionist', createReceptionistProfile);

module.exports = router;