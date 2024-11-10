const Appointment = require("../models/appointmentModel")
const Patient = require("../models/patientModel");
const DentistSchedule = require('../models/dentistScheduleModel');

exports.getDentistFreeSlots=async(req, res) =>{
  try {
    const { appointmentId } = req.body;

    // Step 1: Find the dentist associated with the given appointment ID
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found." });
    }
    const { dentist_id, appointment_date } = appointment;

    // Step 2: Find all booked times for this dentist on the same date
    const bookedSlots = await Appointment.find({
      dentist_id: dentist_id,
      appointment_date: appointment_date,
      status: 'booked'
    }).select('appointment_time');

    // Convert booked slots into a Set for easier lookup
    const bookedTimesSet = new Set(bookedSlots.map(slot => slot.appointment_time.toString()));

    // Step 3: Find available slots for this dentist on the same date in Dentist_Schedule
    const availableSlots = await DentistSchedule.find({
      dentist_id: dentist_id,
      available_date: appointment_date
    }).select('available_time');

    // Step 4: Filter available slots to exclude any booked times
    const freeSlots = availableSlots.filter(
      slot => !bookedTimesSet.has(slot.available_time.toString())
    );

    // Step 5: Return the list of free slots
    if (freeSlots.length > 0) {
      res.status(200).json({
        dentistId: dentist_id,
        date: appointment_date,
        freeSlots: freeSlots.map(slot => slot.available_time)
      });
    } else {
      res.status(200).json({ message: "No available slots found." });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching available slots", error: error.message });
  }
}

exports.selectDate = async (req, res) => {
    const apt_date = req.body.apt_date;
    const valid = isValidDateFormat(apt_date);
    if (!valid) {
        return res.status(404).json({ message: "invalid date" });
    }
    const aptID = req.body.aptID;
    const appointment = await Appointment.findOneAndUpdate(
        { aptID },
        {apt_date,},
        { new: true } // Return the updated document
    );
    res.status(200).json({
        message: "Updated appointment successfully",
        appointment: appointment
    });
    
};

exports.createAppointment = async (req, res) => {
    try {
        const pID = req.body.pID;

        const patientExists = await Patient.findOne({ pID: pID });
        if (!patientExists) {
            return res.status(400).json({
                message: `Patient with ID ${pID} does not exist`
            });
        }
        const dentistId = patientExists.dentistId
        const newAppointment = new Appointment({
            pID,
            dentistId
        });

        await newAppointment.save();
        console.log("New Appointment saved:", newAppointment);

        res.status(201).json({
            message: "Appointment created successfully",
            Appointment: newAppointment
        });

    } catch (error) {
        res.status(500).json({
            message: "Error saving patient data",
            error: error.message
        });
    }
};

exports.getAvailableTime = async (req, res) => {
  try {
    // Step 1: Get aptID and date from the request body
    const { aptID, date } = req.body;

    // Step 2: Find the patient using the appointment ID to retrieve dentistId
    const patient = await Patient.findOne({ aptID: aptID });
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    const dentistId = patient.dentistId;

    // Step 3: Find all appointments with the specified dentistId and date
    const appointments = await Appointment.find({ dentistId: dentistId, apt_date: date });

    // Step 4: Extract times for the booked appointments
    const bookedTimes = appointments.map((appointment) => appointment.time); // Assuming 'time' is a separate field

    // Step 5: Send the booked times as a response
    res.status(200).json({
      dentistId: dentistId,
      date: date,
      bookedTimes: bookedTimes,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching appointment times",
      error: error.message,
    });
  }
};

exports.selectTime = async (req,res) => {
    try {
        aptID = req.body.aptID
        apt_time=req.body.apt_time
        const appointment = await Appointment.findOneAndUpdate(
            { aptID },
            {apt_time,},
            { new: true } // Return the updated document
        );
        res.status(200).json({
            message: "Updated appointment successfully",
            appointment
        });
    } catch (error) {
        res.status(500).json({
            message: "Error fetching appointment times",
            error: error.message,
        });       
    }
};

function isValidDateFormat(dateString) {
    // Check if the date is in YYYY-MM-DD format
    const date = new Date(dateString);
    const [year, month, day] = dateString.split('-');

    return date.getFullYear() === parseInt(year, 10) &&
        date.getMonth() + 1 === parseInt(month, 10) &&
        date.getDate() === parseInt(day, 10);
};