var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var Sensor   = require('./sensor');

var raspiSchema = new Schema({
  model: String, 
  active: {
    type: Boolean, 
    default: false
  },
  sensors: [{
    type: Schema.Types.ObjectId,
    ref: 'Sensor'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date, 
    default: Date.now
  }
});

module.exports = mongoose.model('Raspi', raspiSchema);

