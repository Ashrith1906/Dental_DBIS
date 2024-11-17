const Appointment = require("../models/appointmentModel")
const Patient = require("../models/patientModel");
const DentistSchedule = require('../models/dentistScheduleModel');
const Dentist = require('../models/dentistModel');

const generateSlots = (startTime, endTime) => {
  const slots = [];
  let start = new Date(`1970-01-01T${startTime}:00`);
  const end = new Date(`1970-01-01T${endTime}:00`);

  while (start < end) {
    const nextSlot = new Date(start.getTime() + 20 * 60 * 1000);
    slots.push(start.toTimeString().substring(0, 5)); // Add HH:mm format
    start = nextSlot;
  }

  return slots;
};

// Create or update dentist's schedule
exports.createDentistSchedule = async (req, res) => {
  const { dentistId, timeRanges } = req.body;

  if (!dentistId || !timeRanges || !Array.isArray(timeRanges)) {
    return res.status(400).json({
      message: "Invalid input. Ensure dentistId and timeRanges are provided and correctly formatted.",
    });
  }

  try {
    // Generate 20-minute slots for each time range
    let availableTime = [];
    timeRanges.forEach(range => {
      const slots = generateSlots(range.startTime, range.endTime);
      availableTime = [...availableTime, ...slots];
    });

    // Find existing schedule for the dentist
    let schedule = await DentistSchedule.findOne({ dentistId });

    if (schedule) {
      // Update only the specific dentist's schedule
      schedule.availableTime = availableTime;
      await schedule.save();
      return res.status(200).json({
        message: "Dentist schedule updated successfully.",
        schedule,
      });
    } else {
      // Create a new schedule if none exists for the dentist
      schedule = new DentistSchedule({ dentistId, availableTime });
      await schedule.save();
      return res.status(201).json({
        message: "Dentist schedule created successfully.",
        schedule,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Error creating or updating dentist schedule.",
      error: error.message,
    });
  }
};

// Retrieve a dentist's schedule by dentistId
exports.getDentistSchedule = async (req, res) => {
  const dentistId = req.query.dentistId;

  if (!dentistId) {
    return res.status(400).json({
      message: "Dentist ID is required.",
    });
  }

  try {
    const schedule = await DentistSchedule.findOne({ dentistId });

    if (!schedule) {
      return res.status(404).json({
        message: `No schedule found for Dentist with ID ${dentistId}`,
      });
    }

    return res.status(200).json({
      message: "Dentist schedule retrieved successfully.",
      schedule,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error retrieving dentist schedule.",
      error: error.message,
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

exports.getAllAppointmentsByPID = async (req,res) => {
  try {
    const pID = req.query.pID;
    const appointment = await Appointment.find({pID:pID});
    if (appointment.length === 0) {
      return res.status(404).json({ message: "No appointments found" });
    }

    res.status(200).json({
      message: "appointments retrieved successfully",
      appointment
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving appointments",
      error: error.message
    });
  }
}

exports.getAllAppointmentsByDentistId = async (req,res) => {
  try {
    const dentistId = req.query.dentistId;
    const appointment = await Appointment.find({dentistId:dentistId});
    if (appointment.length === 0) {
      return res.status(404).json({ message: "No appointments found" });
    }

    res.status(200).json({
      message: "appointments retrieved successfully",
      appointment
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving appointments",
      error: error.message
    });
  }
}

exports.getAllAppointments = async (req,res)=>{
  try {
    const appointment = await Appointment.find();
    if (appointment.length === 0) {
      return res.status(404).json({ message: "No appointments found" });
    }

    res.status(200).json({
      message: "appointments retrieved successfully",
      appointment
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving appointments",
      error: error.message
    });
  }
}

// Get appointment details by aptID
exports.getAppointmentDetailsByAptID = async (req, res) => {
  const { aptID } = req.params;

  try {
    // Find the appointment by aptID
    const appointment = await Appointment.findOne({ aptID });

    if (!appointment) {
      return res.status(404).json({ message: `No appointment found with ID ${aptID}` });
    }

    // Fetch patient details
    const patient = await Patient.findOne({ pID: appointment.pID });
    if (!patient) {
      return res.status(404).json({ message: `No patient found with ID ${appointment.pID}` });
    }

    // Fetch dentist details
    const dentist = await Dentist.findOne({ dentistId: appointment.dentistId });
    if (!dentist) {
      return res.status(404).json({ message: `No dentist found with ID ${appointment.dentistId}` });
    }

    // Combine all details into a single response
    const appointmentDetails = {
      appointment: {
        aptID: appointment.aptID,
        date: appointment.apt_date,
        time: appointment.apt_time,
        reason: appointment.reason,
        status: appointment.status,
      },
      patient: {
        name: patient.name,
        age: patient.age,
        gender: patient.gender,
        phone: patient.phone_no,
        address: patient.address,
        history: patient.past_history,
      },
      dentist: {
        name: dentist.name,
        specialization: dentist.specialization,
        experience: dentist.experience,
        phone: dentist.phone_no,
        email: dentist.email,
      },
    };

    res.status(200).json({
      message: 'Appointment details retrieved successfully',
      details: appointmentDetails,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving appointment details', error: error.message });
  }
};