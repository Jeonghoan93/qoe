const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const telemetryDataModel = require('./models/telemetry');

mongoose.connect('mongodb://localhost:/urlTelemetry', {
    useNewUrlParser: true, useUnifiedTopology: true
});

app.set('view engine', 'ejs')

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.render('index', {telemetryData: qoeIndexes});
});

app.post('/telemetry', (req, res) => {
    const { frameSize, availableBitrates, bitrateSwitches, numBuffering, timeSpentBuffering } = req.body;
    telemetryDataModel.create({
        frameSize, availableBitrates, bitrateSwitches, numBuffering, timeSpentBuffering
    }).then(() => {
        res.sendStatus(201);
    }).catch((err) => {
        console.log(err);
        res.sendStatus(500);
    });
    const qoeIndexes = calculateQoeIndexes(req.body);
    res.json(qoeIndexes);
});

function calculateQoeIndexes(telemetryData) {
    const highestBitratePossible = calculateHighestBitratePossible(telemetryData);
    const tooManyBitrateSwitches = calculateTooManyBitrateSwitches(telemetryData);
    const tooManyBuffering = calculateTooManyBuffering(telemetryData);
    return {
        highestBitratePossible,
        tooManyBitrateSwitches,
        tooManyBuffering
    };
}

function calculateHighestBitratePossible(telemetryData) {
    const highestBitratePossible = telemetryData.availableBitrates[telemetryData.availableBitrates.length-1] > telemetryData.frameSize;
    return highestBitratePossible;
}

function calculateTooManyBitrateSwitches(telemetryData) {
    const tooManyBitrateSwitches = telemetryData.bitrateSwitches > 2 / 10;
    return tooManyBitrateSwitches;
}

function calculateTooManyBuffering(telemetryData) {
    const tooManyBuffering = (telemetryData.numBuffering > 3 / 30) || (telemetryData.timeSpentBuffering > 1);
    return tooManyBuffering;
}

app.listen(process.env.PORT || 3001, () => {
    console.log(`QoE service started on port ${process.env.PORT || 3001}`)
})
