const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    aptID: {
      type: String,
      required: true,
    },
    apt_date: {
      type: Date,
    },
    reason: {
        type: String,
    },
    primaryDiagnosis: {
        type: String,
        required:true
    },
    priscription:{
        type: String,
        required:true
    },
    procedures:{
        type: String,
        required : true
    }
});

const report = mongoose.model('report',reportSchema);

module.exports = report