const express = require("express");
const router = express.Router();
const {createPatient,getAllPatients,getPatientById,deletePatientById,updatePatient}=require('../controllers/patientController');


router.post("/create", createPatient);

router.get("/list", getAllPatients);

router.get("/getPatientById",getPatientById)

router.delete("/deletePatientById",deletePatientById)

router.post("/update", updatePatient);

module.exports = router;
