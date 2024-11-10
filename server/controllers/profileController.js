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
    // let dentistProfile = await Dentist.findOne({ dentistId: dentistId });

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

exports.getDentistProfile = async (req,res) =>{
  try {
    const dentistId = req.body.dentistId
    const dentist = await Dentist.find( {dentistId : dentistId});
    if (!dentist) {
      return res.status(404).json({
        message: `Dentist with ID ${dentistId} does not exist`
    });}
    res.status(200).json({
      message: "dentists retrieved successfully",
      dentist
    });

  } catch (error) {
    res.status(500).json({
      message: "Error retrieving dentists",
      error: error.message
    });
  }
}

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

exports.getAllDentists = async (req, res) => {
  try {
    const dentists = await Dentist.find();
    if (dentists.length === 0) {
      return res.status(404).json({ message: "No dentists found" });
    }

    res.status(200).json({
      message: "dentists retrieved successfully",
      dentists
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving dentists",
      error: error.message
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