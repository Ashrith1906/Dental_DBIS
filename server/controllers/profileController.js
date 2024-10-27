// server/controllers/profileController.js
const Dentist = require("../models/dentistModel");
const Reception = require("../models/receptionModel");
const User = require("../models/userModel");

exports.createDoctorProfile = async (req, res) => {
  const { doctorId, name, specialization, phone_no, experience } = req.body;

  try {
    // Find the user by doctorId
    const user = await User.findOne({ doctorId });
    if (!user || user.role !== "Doctor") {
      return res
        .status(404)
        .json({ message: "User not found or not a doctor" });
    }

    // Check if a dentist profile already exists
    let dentistProfile = await Dentist.findOne({ dentistId: doctorId });

    if (dentistProfile) {
      // Update existing profile
      dentistProfile.name = name;
      dentistProfile.specialization = specialization;
      dentistProfile.phone_no = phone_no;
      dentistProfile.experience = experience;
      dentistProfile.email = user.email; // Use the email from the user

      await dentistProfile.save(); // Save the updated profile
      return res.status(200).json({
        message: "Doctor profile updated successfully",
        dentistProfile,
      });
    } else {
      // Create a new dentist profile
      dentistProfile = new Dentist({
        dentistId: doctorId, // Use doctorId as dentistId
        name,
        specialization,
        phone_no,
        experience,
        email: user.email, // Use the email from the user
      });

      await dentistProfile.save(); // Save the new profile
      return res.status(201).json({
        message: "Doctor profile created successfully",
        dentistProfile,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error creating or updating doctor profile",
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
