const Patient = require("../models/patientModel");
const Doctor = require("../models/dentistModel");

// Create a new patient
exports.createPatient = async (req, res) => {
  try {
    const { name, dob, age, gender, phone_no, past_history, current_status, address , doctorId} = req.body;

    // Validate required fields
    if (!name || !dob || !age || !gender || !phone_no || !past_history || !current_status || !address || !doctorId) {
      return res.status(400).json({
        message: "Please provide all required fields: name, dob, age, gender, phone_no, past_history, current_status, address"
      });
    }

    const doctorExists = await Doctor.findOne({ dentistId: doctorId });

    if (!doctorExists) {
      return res.status(400).json({
        message: `Doctor with ID ${doctorId} does not exist`
      });
    }

    
    // Create a new Patient instance with provided details
    const newPatient = new Patient({
      name,
      dob,
      age,
      gender,
      phone_no,
      past_history,
      current_status,
      address,
      doctorId
    });

    // Save the new patient to the database
    await newPatient.save();
    console.log("New Patient saved:", newPatient);

    res.status(201).json({
      message: "Patient data saved successfully",
      patient: newPatient
    });
  } catch (error) {
    res.status(500).json({
      message: "Error saving patient data",
      error: error.message
    });
  }
};

// Get all patients
exports.getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find();
    if (patients.length === 0) {
      return res.status(404).json({ message: "No patients found" });
    }

    res.status(200).json({
      message: "Patients retrieved successfully",
      patients
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving patients",
      error: error.message
    });
  }
};

// Get a single patient by pID
exports.getPatientById = async (req, res) => {
  try {
    const { pID } = req.params;

    const patient = await Patient.findOne({ pID });
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.status(200).json({
      message: "Patient retrieved successfully",
      patient
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving patient",
      error: error.message
    });
  }
};

// Update a patient's details by pID
exports.updatePatient = async (req, res) => {
  try {
    const { pID } = req.params;
    const { name, dob, age, gender, phone_no, past_history, current_status, address } = req.body;

    // Validate required fields
    if (!name || !dob || !age || !gender || !phone_no || !past_history || !current_status || !address) {
      return res.status(400).json({
        message: "Please provide all required fields: name, dob, age, gender, phone_no, past_history, current_status, address"
      });
    }

    // Validate phone number format (10 digits)
    if (!/^\d{10}$/.test(phone_no)) {
      return res.status(400).json({
        message: "Phone number must be a 10-digit number"
      });
    }

    // Find and update the patient by pID
    const patient = await Patient.findOneAndUpdate(
      { pID },
      {
        name,
        dob,
        age,
        gender,
        phone_no,
        past_history,
        current_status,
        address
      },
      { new: true } // Return the updated document
    );

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.status(200).json({
      message: "Patient updated successfully",
      patient
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating patient data",
      error: error.message
    });
  }
};

// Delete a patient by pID
exports.deletePatient = async (req, res) => {
  try {
    const { pID } = req.params;

    const patient = await Patient.findOneAndDelete({ pID });
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.status(200).json({
      message: "Patient deleted successfully",
      patient
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting patient",
      error: error.message
    });
  }
};
