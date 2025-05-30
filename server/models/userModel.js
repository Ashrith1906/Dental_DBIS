// // server/models/userModel.js
// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');

// const userSchema = new mongoose.Schema({
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//     match: [/.+\@.+\..+/, 'Please fill a valid email address']
//   },
//   password: {
//     type: String,
//     required: true,
//     minlength: 6
//   },
//   role: {
//     type: String,
//     required: true,
//     enum: ['Dentist', 'Receptionist']
//   },
//   dentistId: {
//     type: String
//   },
//   receptionistId: {
//     type: String
//   }
// });

// // Helper function to generate the next sequential ID based on role
// async function generateNextId(role) {
//   const prefix = role === 'Dentist' ? 'd' : 'r';
//   const idField = role === 'Dentist' ? 'dentistId' : 'receptionistId';

//   try {
//     // Find the user with the highest existing ID for the given role
//     const latestUser = await mongoose.model('User').findOne({ role })
//       .sort({ [idField]: -1 })
//       .select(idField);

//     // Generate the next ID in sequence
//     if (latestUser && latestUser[idField]) {
//       const latestId = latestUser[idField];
//       const numericPart = parseInt(latestId.slice(1), 10); // Extract numeric part
//       const nextId = prefix + String(numericPart + 1).padStart(3, '0'); // Increment and format
//       console.log(`Generated next ID for ${role}: ${nextId}`);
//       return nextId;
//     } else {
//       // Start sequence if no IDs exist for the role
//       console.log(`Starting ID sequence for ${role}`);
//       return prefix + '001';
//     }
//   } catch (error) {
//     console.error(`Error generating next ID for ${role}: ${error.message}`);
//     throw error;
//   }
// }

// // Pre-validate middleware for generating IDs and hashing password
// userSchema.pre('validate', async function(next) {
//   if (this.isNew && this.role) {
//     try {
//       // Generate a sequential ID based on role
//       if (this.role === 'Dentist' && !this.dentistId) {
//         this.dentistId = await generateNextId('Dentist');
//       } else if (this.role === 'Receptionist' && !this.receptionistId) {
//         this.receptionistId = await generateNextId('Receptionist');
//       }

//       next();
//     } catch (error) {
//       next(error);
//     }
//   } else {
//     next();
//   }
// });

// userSchema.pre('save', async function(next) {
//   // Hash password only if it has been modified
//   if (this.isModified('password')) {
//     try {
//       const salt = await bcrypt.genSalt(10);
//       this.password = await bcrypt.hash(this.password, salt);
//     } catch (error) {
//       return next(error);
//     }
//   }
//   next();
// });

// // Method for comparing passwords
// userSchema.methods.comparePassword = async function(enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

// const User = mongoose.model('User', userSchema);

// module.exports = User;

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