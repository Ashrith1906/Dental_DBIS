const Appointment = require("../models/appointmentModel")
const Patient = require("../models/patientModel");
const DentistSchedule = require('../models/dentistScheduleModel');

// Create or update dentist's schedule
exports.createDentistSchedule = async (req, res) => {
  const { dentistId, availableTime } = req.body;

  try {
    // Find existing schedule for the dentist
    let schedule = await DentistSchedule.findOne({ dentistId });

    if (schedule) {
      // Update existing schedule's availableTime
      schedule.availableTime = availableTime;
      await schedule.save();
      res.status(200).json({
        message: "Dentist schedule updated successfully",
        schedule
      });
    } else {
      // Create a new schedule if none exists
      schedule = new DentistSchedule({ dentistId, availableTime });
      await schedule.save();
      res.status(201).json({
        message: "Dentist schedule created successfully",
        schedule
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error creating or updating dentist schedule",
      error: error.message
    });
  }
};

// Retrieve a dentist's schedule by dentistId
exports.getDentistSchedule = async (req, res) => {
  const { dentistId } = req.params;

  try {
    const schedule = await DentistSchedule.findOne({ dentistId });

    if (!schedule) {
      return res.status(404).json({
        message: `No schedule found for Dentist with ID ${dentistId}`
      });
    }

    res.status(200).json({
      message: "Dentist schedule retrieved successfully",
      schedule
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving dentist schedule",
      error: error.message
    });
  }
};

// Get dentistId from patientId (pID)
exports.getDentistIdByPatientId = async (req, res) => {
  const { pID } = req.params;
  try {
    const patient = await Patient.findOne({ pID });

    if (!patient) {
      return res.status(404).json({ message: `Patient with ID ${pID} not found` });
    }

    res.status(200).json({ dentistId: patient.dentistId });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dentistId', error: error.message });
  }
};

exports.getAvailableSlotsByDentistId = async (req, res) => {
  const { dentistId, date } = req.params;

  try {
    // Retrieve the dentist's schedule to get all available slots
    const schedule = await DentistSchedule.findOne({ dentistId });

    if (!schedule) {
      return res.status(404).json({ message: `No schedule found for Dentist with ID ${dentistId}` });
    }

    // Fetch existing appointments for the given dentist and date
    const existingAppointments = await Appointment.find({
      dentistId,
      apt_date: date,
      status: "booked" // You can also include additional status filters like "confirmed" if needed
    });

    // Extract the booked slots from the existing appointments
    const bookedSlots = existingAppointments.map(appointment => appointment.apt_time);

    // Filter available slots by excluding booked ones
    const availableSlots = schedule.availableTime.filter(slot => !bookedSlots.includes(slot));

    res.status(200).json({
      message: "Available slots for the given date",
      availableSlots
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching available slots', error: error.message });
  }
};

exports.createAppointment = async (req, res) => {
  try {
    const { pID, date, slot, reason } = req.body;

    // Check if the patient exists
    const patient = await Patient.findOne({ pID });
    if (!patient) {
      return res.status(400).json({ message: `Patient with ID ${pID} does not exist` });
    }

    const dentistId = patient.dentistId;

    // Check if dentist has availability on the given date
    const dentistSchedule = await DentistSchedule.findOne({ dentistId });
    if (!dentistSchedule) {
      return res.status(404).json({ message: `No schedule found for Dentist with ID ${dentistId}` });
    }

    // Validate the selected slot against the available times
    if (!dentistSchedule.availableTime.includes(slot)) {
      return res.status(400).json({ message: `Requested slot ${slot} is not available.` });
    }

    // Check if there is already an appointment for the same patient, dentist, date, and slot
    const existingAppointment = await Appointment.findOne({
      pID,
      dentistId,
      apt_date: date,
      apt_time: slot
    });

    if (existingAppointment) {
      return res.status(400).json({ message: `An appointment already exists for this patient at this time.` });
    }

    // Create and save new appointment
    const newAppointment = new Appointment({
      pID,
      dentistId,
      apt_date: date,
      apt_time: slot,
      reason,
      status: "booked"
    });

    await newAppointment.save();
    res.status(201).json({
      message: "Appointment created successfully",
      appointment: newAppointment
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating appointment', error: error.message });
  }
};