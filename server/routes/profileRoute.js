const express = require('express');
const { createDentistProfile,getDentistProfile,updateDentistProfile, createDentistSchedule,getAllDentists } = require('../controllers/profileController');
const router = express.Router();

router.post('/dentist', createDentistProfile);

router.get('/dentist',getDentistProfile)

router.put('/dentist',updateDentistProfile)

router.get('/getAllDentists',getAllDentists);

router.post('/createDentistSchedule',createDentistSchedule)

module.exports = router;