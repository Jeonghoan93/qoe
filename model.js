const Sequelize = require('sequelize');
const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'mysql',
    server: {
        port: 3001,
        endpoint: 'http://localhost:3001/telemetry', // endpoint of the server
        timeout: 5000,
    },
    qoeIndexes: {
        bufferLevel: {
            threshold: 0.8,
        },
        downloadSpeed: {
            threshold: 2, // number of switches per 10 secs
            interval: 10000,
        },
        buffering: {
            threshold: {
                count: 3, // number of buffering events per 30 secs
                duration: 500 // buffering duration threshold
            },
            interval: 30000,
        },
    }
});

const telemetryData = sequelize.define('telemetry', {
    frameSize: {
      type: Sequelize.INTEGER
    },
    availableBitrates: {
      type: Sequelize.STRING
    },
    bitrateSwitches: {
      type: Sequelize.INTEGER
    },
    numBuffering: {
      type: Sequelize.INTEGER
    },
    timeSpentBuffering: {
      type: Sequelize.INTEGER
    }
  });

telemetryData.sync();

module.exports = telemetryData;

