const axios = require('axios');

(function () {
    amp.plugin('telemetry', function (options) {

        var player = this;

        var init = function () {
            console.log("plugin telemetry initialized with player ", player)

            var telemetryData = {};

            // collect the video frame size
            telemetryData.videoFrameSize = {
                height: player.videoHeight(),
                width: player.videoWidth()
            };

            // collect the available video bitrates
            telemetryData.availableVideoBitrates = [];
            var videoStreams = player.currentVideoStreamList();
            for (var i = 0; i < videoStreams.length; i++) {
                telemetryData.availableVideoBitrates.push(videoStreams[i].bitrate);
            }

            // collect the number of bitrate switches
            var bitrateSwitchCounter = 0;
            player.addEventListener('bitrateChange', function() {
                bitrateSwitchCounter++;
                sendTelemetryData();
            });
            telemetryData.bitrateSwitches = bitrateSwitchCounter;

            // Collect telemetry data
            var bufferingCounter = 0;
            player.addEventListener('buffering', function() {
                bufferingCounter++;
                sendTelemetryData();
            });
            telemetryData.numberOfBuffering = bufferingCounter;

            var bufferingStartTime;
            player.addEventListener('buffering', function() {
                bufferingStartTime = performance.now();
                setTimeout(sendTelemetryData, 10000);
            });

            player.addEventListener('buffered', function() {
                var bufferingEndTime = performance.now();
                var timeSpentBuffering = bufferingEndTime - bufferingStartTime;
                telemetryData.timeSpentBuffering = timeSpentBuffering;
                sendTelemetryData();
            });

            // Send telemetry data to the server
            function sendTelemetryData() {
                axios.post('http://localhost:3001/telemetry', telemetryData)
                .then(function (response) {
                    console.log(response);
                })
                .catch(function (error) {
                    console.log(error);
                });
            }
            setInterval(sendTelemetryData, 1000); // send data every 1 sec
            
        };
        // initialize the plugin
        init();
    });
}).call(this);