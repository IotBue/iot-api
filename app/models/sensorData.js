var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var sensorDataSchema = new Schema({
  value: {
    type: Number,
    default: 0
  },
  sentAt: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('SensorData', sensorDataSchema);
