const mongoose = require('mongoose'); 

const telemetrySchema = new mongoose.Schema({
    frameSize: { 
        type: Number, 
        required: true
    },
    availableBitrates: { 
        type: [Number], 
        required: true 
    },
    bitrateSwitches: { 
        type: Number, 
        required: true 
    },
    numBuffering: { 
        type: Number,
        required: true
    },
    timeSpentBuffering: {
        type: Number,
        required: true
    }, 
});

module.exports = mongoose.model('Telemetry', telemetrySchema);