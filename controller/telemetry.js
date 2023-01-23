const Telemetry = require("../modeles/telemetry.js");

exports.createTelemetry = (req, res, next) => {
  const telemetry = new Telemetry({
    videoFrameSize: req.body.videoFrameSize,
    availableVideoBitrates: req.body.availableVideoBitrates,
    bitrateSwitches: req.body.bitrateSwitches,
    bufferCount: req.body.bufferCount,
    bufferDuration: req.body.bufferDuration
  });
  telemetry
    .save()
    .then(createdTelemetry => {
      res.status(201).json({
        message: "Telemetry added successfully",
        telemetry: {
          ...createdTelemetry,
          id: createdTelemetry._id
        }
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Creating a telemetry failed!"
      });
    });
};