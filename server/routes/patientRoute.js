// const express = require('express')
// const router = express.Router()
// const { createPatient } = require('../controllers/patientController');

// router.post('/', createPatient);

// module.exports = router;

// routes/patientRoutes.js
const express = require("express");
const router = express.Router();
// const patientController = require("../controllers/patientController");
const {createPatient,getAllPatients,getPatientById,deletePatient,updatePatient}=require('../controllers/patientController');
// Create a new patient
router.post("/create", createPatient);

router.get("/list", getAllPatients);


module.exports = router;
