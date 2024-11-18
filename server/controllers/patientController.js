const Patient = require("../models/patientModel");
const Dentist = require("../models/dentistModel");
const Appointment = require("../models/appointmentModel");
const Invoice = require('../models/invoiceModel')
const Report = require('../models/reportModel')

// Create a new patient
exports.createPatient = async (req, res) => {
  try {
    const {
      name,
      dob,
      age,
      gender,
      phone_no,
      past_history,
      current_status,
      address,
      dentistId,
    } = req.body;

    // Validate required fields
    if (
      !name ||
      !dob ||
      !age ||
      !gender ||
      !phone_no ||
      !past_history ||
      !current_status ||
      !address ||
      !dentistId
    ) {
      return res.status(400).json({
        message:
          "Please provide all required fields: name, dob, age, gender, phone_no, past_history, current_status, address",
      });
    }

    const dentistExists = await Dentist.findOne({ dentistId: dentistId });

    if (!dentistExists) {
      return res.status(400).json({
        message: `Dentist Profile with ID ${dentistId} does not exist`,
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
      dentistId,
    });

    // Save the new patient to the database
    await newPatient.save();
    console.log("New Patient saved:", newPatient);

    res.status(201).json({
      message: "Patient data saved successfully",
      patient: newPatient,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error saving patient data",
      error: error.message,
    });
  }
};

// Get all patients with their respective dentist's name using aggregate
exports.getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.aggregate([
      {
        $lookup: {
          from: "dentists", // Name of the dentist collection in MongoDB
          localField: "dentistId", // The field in Patient document
          foreignField: "dentistId", // The field in Dentist document (assuming it's dentistId)
          as: "dentistDetails", // Alias for the result of the lookup
        },
      },
      {
        $unwind: {
          path: "$dentistDetails", // Unwind the dentistDetails array to get each dentist name
          preserveNullAndEmptyArrays: true, // Allow patients with no dentist to be returned
        },
      },
      {
        $project: {
          name: 1,
          dob: 1,
          age: 1,
          gender: 1,
          phone_no: 1,
          past_history: 1,
          current_status: 1,
          address: 1,
          dentistId:1,
          dentistName: { $ifNull: ["$dentistDetails.name", "No Dentist Assigned"] }, // Default to 'No Dentist Assigned' if dentist is not found
          pID: 1,
        },
      },
    ]);

    if (patients.length === 0) {
      return res.status(404).json({ message: "No patients found" });
    }

    res.status(200).json({
      message: "Patients retrieved successfully",
      patients,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving patients",
      error: error.message,
    });
  }
};

// Get a single patient by pID
exports.getPatientById = async (req, res) => {
  try {
    const { pID } = req.query;

    const patient = await Patient.findOne({ pID });
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.status(200).json({
      message: "Patient retrieved successfully",
      patient,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving patient",
      error: error.message,
    });
  }
};

// Update a patient's details by pID
exports.updatePatient = async (req, res) => {
  try {
    const { pID } = req.query;
    const {
      name,
      dob,
      age,
      gender,
      phone_no,
      past_history,
      current_status,
      address,
    } = req.body;

    // Validate required fields
    if (
      !name ||
      !dob ||
      !age ||
      !gender ||
      !phone_no ||
      !past_history ||
      !current_status ||
      !address
    ) {
      return res.status(400).json({
        message:
          "Please provide all required fields: name, dob, age, gender, phone_no, past_history, current_status, address",
      });
    }

    // Validate phone number format (10 digits)
    if (!/^\d{10}$/.test(phone_no)) {
      return res.status(400).json({
        message: "Phone number must be a 10-digit number",
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
        address,
      },
      { new: true } // Return the updated document
    );

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.status(200).json({
      message: "Patient updated successfully",
      patient,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating patient data",
      error: error.message,
    });
  }
};

// To delete a patient by it's ID
exports.deletePatientById = async (req, res) => {
  try {
    const { pID } = req.query;

    // Find and delete the patient
    const patient = await Patient.findOneAndDelete({ pID: pID });
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Find all appointments associated with the patient
    const appointments = await Appointment.find({ pID: pID });
    if (appointments.length > 0) {
      const appointmentIds = appointments.map(appointment => appointment._id);

      // Delete all invoices and reports linked to the appointments
      await Invoice.deleteMany({ aptID: { $in: appointmentIds } });
      await Report.deleteMany({ aptID: { $in: appointmentIds } });

      // Delete all appointments
      await Appointment.deleteMany({ pID: pID });
    }

    res.status(200).json({
      message: "Patient, associated appointments, invoices, and reports deleted successfully",
      patient,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting patient and related data",
      error: error.message,
    });
  }
};
