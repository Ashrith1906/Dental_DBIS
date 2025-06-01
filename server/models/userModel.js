// models/userModel.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { generateNextPatientId } = require("../utils/idGenerator");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+\@.+\..+/, 'Please fill a valid email address']
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    required: true,
    enum: ['Dentist', 'Receptionist', 'Patient']
  },
  dentistId: String,
  receptionistId: String,
  patientId: String
});

async function generateNextId(role) {
  const prefixMap = { Dentist: 'd', Receptionist: 'r' };
  const idFieldMap = { Dentist: 'dentistId', Receptionist: 'receptionistId' };

  if (role === 'Patient') {
    return await generateNextPatientId(); // Safe now
  }

  const User = mongoose.model("User");
  const prefix = prefixMap[role];
  const idField = idFieldMap[role];

  const latestUser = await User.findOne({ role, [idField]: { $exists: true } })
    .sort({ [idField]: -1 })
    .select(idField);

  const num = parseInt(latestUser?.[idField]?.slice(1) || '0', 10);
  return prefix + String(num + 1).padStart(3, '0');
}

userSchema.pre('validate', async function (next) {
  if (this.isNew && this.role) {
    try {
      if (this.role === 'Dentist' && !this.dentistId) {
        this.dentistId = await generateNextId('Dentist');
      } else if (this.role === 'Receptionist' && !this.receptionistId) {
        this.receptionistId = await generateNextId('Receptionist');
      } else if (this.role === 'Patient' && !this.patientId) {
        this.patientId = await generateNextId('Patient');
      }
      next();
    } catch (err) {
      next(err);
    }
  } else {
    next();
  }
});

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    } catch (error) {
      return next(error);
    }
  }
  next();
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);