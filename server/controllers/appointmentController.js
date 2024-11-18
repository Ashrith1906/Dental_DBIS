const Appointment = require("../models/appointmentModel");
const Patient = require("../models/patientModel");
const DentistSchedule = require("../models/dentistScheduleModel");
const Dentist = require("../models/dentistModel");
const Invoice = require('../models/invoiceModel');
const Report = require('../models/reportModel');
const moment = require("moment");

// To generate slots of 20 min each
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
  const { dentistId, date, timeRanges } = req.body;

  if (!dentistId || !date || !timeRanges || !Array.isArray(timeRanges)) {
    return res.status(400).json({
      message:
        "Invalid input. Ensure dentistId, date, and timeRanges are provided and correctly formatted.",
    });
  }

  try {
    // Generate 20-minute slots for each time range
    let availableTime = [];
    timeRanges.forEach((range) => {
      const slots = generateSlots(range.startTime, range.endTime);
      availableTime = [...availableTime, ...slots];
    });

    // Find existing schedule for the dentist and date
    let schedule = await DentistSchedule.findOne({ dentistId, date });

    if (schedule) {
      // Update schedule for the specified date
      schedule.availableTime = availableTime;
      await schedule.save();
      return res.status(200).json({
        message: "Dentist schedule updated successfully.",
        schedule,
      });
    } else {
      // Create a new schedule for the dentist on the specified date
      schedule = new DentistSchedule({ dentistId, date, availableTime });
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

// Retrieve a dentist's schedule by dentistId and date
exports.getDentistSchedule = async (req, res) => {
  const { dentistId, date } = req.query;

  // Validate required inputs
  if (!dentistId || !date) {
    return res.status(400).json({
      message: "Dentist ID and date are required.",
    });
  }

  try {
    // Find schedule for the specific dentist and date
    const schedule = await DentistSchedule.findOne({ dentistId, date });

    if (!schedule) {
      return res.status(404).json({
        message: `No schedule available for Dentist with ID ${dentistId} on ${date}.`,
      });
    }

    // If schedule exists, return it
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
      return res
        .status(404)
        .json({ message: `Patient with ID ${pID} not found` });
    }

    res.status(200).json({ dentistId: patient.dentistId });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching dentistId", error: error.message });
  }
};

// To get available slots by dentistId
exports.getAvailableSlotsByDentistId = async (req, res) => {
  const { dentistId, date } = req.params;

  try {
    // Retrieve the dentist's schedule for the specific date
    const schedule = await DentistSchedule.findOne({ dentistId, date });

    if (!schedule) {
      // If the schedule doesn't exist for the given date, return no slots available message
      return res
        .status(404)
        .json({
          message: `No slots available for Dentist with ID ${dentistId} on ${date}`,
        });
    }

    // Fetch existing appointments for the given dentist and date
    const existingAppointments = await Appointment.find({
      dentistId,
      apt_date: date,
      status: "booked", // You can also include additional status filters like "confirmed" if needed
    });

    // Extract the booked slots from the existing appointments
    const bookedSlots = existingAppointments.map(
      (appointment) => appointment.apt_time
    );

    // Filter available slots by excluding booked ones
    let availableSlots = schedule.availableTime.filter(
      (slot) => !bookedSlots.includes(slot)
    );

    // Get the current time
    const currentTime = moment(); // Current time using moment.js

    // Filter out slots that have already passed
    availableSlots = availableSlots.filter((slot) => {
      const slotTime = moment(`${date} ${slot}`, "YYYY-MM-DD hh:mm A"); // Parse the slot time

      // Only include future slots
      return slotTime.isAfter(currentTime);
    });

    if (availableSlots.length === 0) {
      return res
        .status(200)
        .json({
          message: `No available slots for Dentist with ID ${dentistId} on ${date}`,
        });
    }

    res.status(200).json({
      message: "Available slots for the given date",
      availableSlots,
    });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error fetching available slots",
        error: error.message,
      });
  }
};

// To create new appointment
exports.createAppointment = async (req, res) => {
  try {
    const { pID, date, slot, reason } = req.body;

    // Validate input
    if (!pID || !date || !slot) {
      return res
        .status(400)
        .json({ message: "pID, date, and slot are required fields." });
    }

    // Find patient by pID
    const patient = await Patient.findOne({ pID });
    if (!patient) {
      return res
        .status(404)
        .json({ message: `Patient with ID ${pID} does not exist.` });
    }

    const dentistId = patient.dentistId;

    // Retrieve dentist's schedule for the given date
    const dentistSchedule = await DentistSchedule.findOne({ dentistId, date });
    if (!dentistSchedule) {
      return res.status(404).json({
        message: `No schedule found for Dentist with ID ${dentistId} on ${date}.`,
      });
    }

    // Check if the slot exists in the available time
    if (!dentistSchedule.availableTime.includes(slot)) {
      return res.status(400).json({
        message: `Requested slot "${slot}" is not available. Available slots: ${dentistSchedule.availableTime.join(
          ", "
        )}`,
      });
    }

    // Check if an appointment already exists for the given details
    const existingAppointment = await Appointment.findOne({
      pID,
      dentistId,
      apt_date: date,
      apt_time: slot,
    });

    if (existingAppointment) {
      return res.status(400).json({
        message: `An appointment already exists for patient ${pID} with Dentist ${dentistId} on ${date} at ${slot}.`,
      });
    }

    // Create new appointment
    const newAppointment = new Appointment({
      pID,
      dentistId,
      apt_date: date,
      apt_time: slot,
      reason,
      status: "booked",
    });

    await newAppointment.save();

    // Remove the booked slot from the dentist's schedule
    dentistSchedule.availableTime = dentistSchedule.availableTime.filter(
      (time) => time !== slot
    );
    await dentistSchedule.save();

    // Respond with the created appointment
    res.status(201).json({
      message: "Appointment created successfully.",
      appointment: newAppointment,
    });
  } catch (error) {
    console.error("Error creating appointment:", error.message);
    res.status(500).json({
      message: "Internal server error. Please try again.",
      error: error.message,
    });
  }
};

// To get all appointments by pID
exports.getAllAppointmentsByPID = async (req, res) => {
  try {
    const pID = req.query.pID;
    const appointment = await Appointment.find({ pID: pID });
    if (appointment.length === 0) {
      return res.status(404).json({ message: "No appointments found" });
    }

    res.status(200).json({
      message: "appointments retrieved successfully",
      appointment,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving appointments",
      error: error.message,
    });
  }
};

// To get all appointments by dentistId
exports.getAllAppointmentsByDentistId = async (req, res) => {
  try {
    const dentistId = req.query.dentistId;

    // Use aggregation to join Appointments with Patients
    const appointments = await Appointment.aggregate([
      { $match: { dentistId: dentistId } }, // Filter appointments by dentistId
      {
        $lookup: {
          from: "patients", // The collection to join with (case-sensitive)
          localField: "pID", // The field in the Appointment collection
          foreignField: "pID", // The field in the Patient collection
          as: "patientInfo" // Alias for the joined data
        }
      },
      {
        $unwind: "$patientInfo" // Flatten the patientInfo array
      },
      {
        $addFields: {
          patientName: "$patientInfo.name" // Add patientName field
        }
      },
      {
        $project: {
          patientInfo: 0 // Exclude the full patientInfo object (optional)
        }
      }
    ]);

    if (appointments.length === 0) {
      return res.status(404).json({ message: "No appointments found" });
    }

    res.status(200).json({
      message: "Appointments retrieved successfully",
      appointments,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving appointments",
      error: error.message,
    });
  }
};

// To get all appointments
exports.getAllAppointments = async (req, res) => {
  try {
    const appointment = await Appointment.find();
    if (appointment.length === 0) {
      return res.status(404).json({ message: "No appointments found" });
    }

    res.status(200).json({
      message: "appointments retrieved successfully",
      appointment,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving appointments",
      error: error.message,
    });
  }
};

// Get appointment details by aptID
exports.getAppointmentDetailsByAptID = async (req, res) => {
  const { aptID } = req.params;

  try {
    // Find the appointment by aptID
    const appointment = await Appointment.findOne({ aptID });

    if (!appointment) {
      return res
        .status(404)
        .json({ message: `No appointment found with ID ${aptID}` });
    }

    // Fetch patient details
    const patient = await Patient.findOne({ pID: appointment.pID });
    if (!patient) {
      return res
        .status(404)
        .json({ message: `No patient found with ID ${appointment.pID}` });
    }

    // Fetch dentist details
    const dentist = await Dentist.findOne({ dentistId: appointment.dentistId });
    if (!dentist) {
      return res
        .status(404)
        .json({ message: `No dentist found with ID ${appointment.dentistId}` });
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
      message: "Appointment details retrieved successfully",
      details: appointmentDetails,
    });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error retrieving appointment details",
        error: error.message,
      });
  }
};

// To delete a appointment by Apt ID
exports.deleteAppointmentByAptID = async (req,res) =>{
  const aptID = req.query.aptID
  const appointment = await Appointment.findOneAndDelete({aptID:aptID})
  if(!appointment) return res.json({ message: `No appointment found with ID ${aptID}` })
  Invoice.deleteMany({aptID:aptID})
  Report.deleteMany({aptID:aptID})
  res.status(200).json({message: "Appointment,associated invoice, and report are deleted successfully",appointment,});
}