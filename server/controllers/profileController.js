// server/controllers/profileController.js
const Dentist = require("../models/dentistModel");
const User = require("../models/userModel");
const DentistSchedule = require('../models/dentistScheduleModel');

// To create a new dentist profile
exports.createDentistProfile = async (req, res) => {
  const { dentistId, name, specialization, phone_no, experience } = req.body;

  try {
    const user = await User.findOne({ dentistId });
    if (!user || user.role !== "Dentist") {
      return res
        .status(404)
        .json({ message: "User not found or not a dentist" });
    }

      const dentistProfile = new Dentist({
        dentistId: dentistId, // Use dentistId as dentistId
        name,
        specialization,
        phone_no,
        experience,
        email: user.email, // Use the email from the user
      });

      await dentistProfile.save(); // Save the new profile
      return res.status(201).json({
        message: "Dentist profile created successfully",
        dentistProfile,
      });
  } catch (error) {
    res.status(500).json({
      message: "Error creating or updating dentist profile",
      error: error.message,
    });
  }
};

// To get a dentist profile from dentistId
exports.getDentistProfile = async (req, res) => {
  try {
    const { dentistId } = req.query; // Retrieve dentistId from query parameters
    const dentist = await Dentist.findOne({ dentistId });

    if (!dentist) {
      return res.status(200).json({
        message: "No profile found. Please create a dentist profile.",
        dentist: null
      });
    }

    res.status(200).json({
      message: "Dentist profile retrieved successfully",
      dentist
    });

  } catch (error) {
    res.status(500).json({
      message: "Error retrieving dentist profile",
      error: error.message
    });
  }
};

// To update a dentist profile
exports.updateDentistProfile = async (req, res) => {
  const { dentistId } = req.body;

  try {
    // Find the existing dentist profile
    let dentistProfile = await Dentist.findOne({ dentistId: dentistId });
    if (!dentistProfile) {
      return res.status(400).json({
        message: "No Existing Dentist Profile",
      });
    }

    // Update only the fields provided in the request body
    const fieldsToUpdate = ['name', 'specialization', 'phone_no', 'experience'];
    fieldsToUpdate.forEach(field => {
      if (req.body[field] !== undefined) {
        dentistProfile[field] = req.body[field];
      }
    });

    await dentistProfile.save(); // Save the updated profile

    return res.status(200).json({
      message: "Dentist profile updated successfully",
      dentistProfile,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error updating dentist profile",
      error: error.message,
    });
  }
};

// To get all dentists
exports.getAllDentists = async (req, res) => {
  try {
    const dentists = await Dentist.find();
    
    if (dentists.length === 0) {
      return res.status(200).json({
        message: "No dentist profiles found. Please create dentist profiles.",
        dentists: []
      });
    }

    res.status(200).json({
      message: "Dentist profiles retrieved successfully",
      dentists
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving dentist profiles",
      error: error.message
    });
  }
};

// To create a new dentist schedule
exports.createDentistSchedule = async (req, res) => {
  try {
    const { dentistId, availableTime } = req.body;

    const dentist = await Dentist.findOne({ dentistId: dentistId });
    if (!dentist) {
      return res.status(404).json({
        message: `Dentist with ID ${dentistId} does not exist`
      });
    }

    // Create new dentist schedule
    const newSchedule = new DentistSchedule({
      dentistId,
      availableTime
    });

    await newSchedule.save();
    res.status(201).json({
      message: "Dentist schedule created successfully",
      schedule: newSchedule
    });

  } catch (error) {
    res.status(500).json({
      message: "Error creating dentist schedule",
      error: error.message
    });
  }
};