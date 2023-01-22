const express = require('express');
const app = express();
const bodyParser = require('body-parser');


app.use(bodyParser.json());

// endpoint to receive telemetry data
app.post('/telemetry', (req, res) => {
    // get the telemetry data from the request body
    const telemetryData = req.body;

    // use the Telemetry.create() method to insert new telemetry data into the database:
    const { frameSize, availableBitrates, bitrateSwitches, numBuffering, timeSpentBuffering } = req.body;
    telemetryData.create({
        frameSize, availableBitrates, bitrateSwitches, numBuffering, timeSpentBuffering
    }).then(() => {
        res.sendStatus(201);
    }).catch((err) => {
        console.log(err);
        res.sendStatus(500);
    });

    // calculate the indexes
    const qoeIndexes = calculateQoeIndexes(telemetryData);

    // send the indexes back to the client
    res.json(qoeIndexes);
});

// function to calculate the QoE indexes
function calculateQoeIndexes(telemetryData) {
    // calculate the highest possible bitrate
    const highestBitratePossible = calculateHighestBitratePossible(telemetryData);

    // calculate the number of bitrate switches
    const tooManyBitrateSwitches = calculateTooManyBitrateSwitches(telemetryData);

    // calculate the number of buffering events
    const tooManyBuffering = calculateTooManyBuffering(telemetryData);

    // return the indexes
    return {
        highestBitratePossible,
        tooManyBitrateSwitches,
        tooManyBuffering
    };
}

// function to calculate the highest possible bitrate
function calculateHighestBitratePossible(telemetryData) {
    // check if the playback bitrate is meant for a smaller player frame size
    const highestBitratePossible = telemetryData.playbackBitrate > telemetryData.frameSize;
    return highestBitratePossible;
}

// function to calculate the number of bitrate switches
function calculateTooManyBitrateSwitches(telemetryData) {
    // check if the number of bitrate switches is higher than 2 every 10 secs
    const tooManyBitrateSwitches = telemetryData.bitrateSwitches > 2 / 10;
    return tooManyBitrateSwitches;
}

// function to calculate the number of buffering events
function calculateTooManyBuffering(telemetryData) {
    // check if the number of buffering events longer than 500ms is higher than 3 per 30 secs or if there is any buffering event longer than 1s
    const tooManyBuffering = (telemetryData.buffering > 3 / 30) || (telemetryData.bufferingTime > 1);
    return tooManyBuffering;
}


app.set('view engine', 'ejs')
app.get('/', (req, res) => {
    res.render('index')
});

app.listen(process.env.PORT || 3001, () =>{
    console.log(`QoE service started on port ${process.env.PORT} or 3001`)
})