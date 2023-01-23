const mongoose = require('mongoose'); 

const telemetrySchema = new mongoose.Schema({
    frameSize: {
        type: String,
        required: true
    },
    availableBitrates: {
        type: Array,
        required: true
    },
    bitrateSwitches: {
        type: Number,
        required: true
    },
    numberOfBuffering: {
        type: Number,
        required: true
    },
    bufferingDuration: {
        type: Number,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});
    
    

module.exports = mongoose.model('Telemetry', telemetrySchema);