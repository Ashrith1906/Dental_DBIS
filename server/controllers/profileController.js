// server/controllers/profileController.js
const Dentist = require("../models/dentistModel");
const Reception = require("../models/receptionModel");
const User = require("../models/userModel");
const DentistSchedule = require('../models/dentistScheduleModel');

exports.createDentistProfile = async (req, res) => {
  const { dentistId, name, specialization, phone_no, experience } = req.body;

  try {
    // Find the user by dentistId
    const user = await User.findOne({ dentistId });
    if (!user || user.role !== "Dentist") {
      return res
        .status(404)
        .json({ message: "User not found or not a dentist" });
    }

    // Check if a dentist profile already exists
    let dentistProfile = await Dentist.findOne({ dentistId: dentistId });

    if (dentistProfile) {
      // Update existing profile
      dentistProfile.name = name;
      dentistProfile.specialization = specialization;
      dentistProfile.phone_no = phone_no;
      dentistProfile.experience = experience;
      dentistProfile.email = user.email; // Use the email from the user

      await dentistProfile.save(); // Save the updated profile
      return res.status(200).json({
        message: "Dentist profile updated successfully",
        dentistProfile,
      });
    } else {
      // Create a new dentist profile
      dentistProfile = new Dentist({
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
    }
  } catch (error) {
    res.status(500).json({
      message: "Error creating or updating dentist profile",
      error: error.message,
    });
  }
};

exports.createReceptionistProfile = async (req, res) => {
  const { receptionistId, name, phone_no, salary } = req.body;

  try {
    // Find the user by receptionistId
    const user = await User.findOne({ receptionistId });
    if (!user || user.role !== "Receptionist") {
      return res
        .status(404)
        .json({ message: "User not found or not a receptionist" });
    }

    // Check if a receptionist profile already exists
    let receptionistProfile = await Reception.findOne({
      repID: receptionistId,
    });

    if (receptionistProfile) {
      // Update existing profile
      receptionistProfile.name = name;
      receptionistProfile.phone_no = phone_no;
      receptionistProfile.salary = salary;
      receptionistProfile.email = user.email; // Use the email from the user

      await receptionistProfile.save(); // Save the updated profile
      return res.status(200).json({
        message: "Receptionist profile updated successfully",
        receptionistProfile,
      });
    } else {
      // Create a new receptionist profile
      receptionistProfile = new Reception({
        repID: receptionistId, // Use receptionistId as repID
        name,
        phone_no,
        email: user.email, // Use the email from the user
        salary,
      });

      await receptionistProfile.save(); // Save the new profile
      return res.status(201).json({
        message: "Receptionist profile created successfully",
        receptionistProfile,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error creating or updating receptionist profile",
      error: error.message,
    });
  }
};

exports.createDentistSchedule = async (req, res) => {
  try {
    const { dentistId, availableTime } = req.body;

    // If you're using dentistId as a string, you don't need to check for ObjectId
    // You can validate that the dentist exists based on the string ID
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