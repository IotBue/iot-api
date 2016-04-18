var Raspi  = require('../models/raspi');
var Sensor = require('../models/sensor');

exports.create = function(request, response) {
  var sensor = new Sensor();
  sensor.pin = request.body.pin;
  sensor.sensorType = request.body.sensorType;
  sensor.active = request.body.active;
  sensor.save(function(error, sensor) {
    if (error) {
      response.send(error);
    } else {
      Raspi.findById(request.params.raspi_id, function(error, raspi) {
        raspi.sensors.push(sensor);
        raspi.save(function(error) {
          if (error) {
            response.send(error);
          } else {
            response.json({ message: 'Sensor creado satisfactoriamente' });
          }
        });
      });
    }
  });
};

exports.index =  function(request, response) {
  Raspi.findById(request.params.raspi_id, function(error, raspi) {
    if (error) {
      response.send(error);
    } else {
      raspi.populate('sensors', function(error, raspi) {
        response.send(raspi);
      });
    }
  });
};
