var Raspi      = require('../models/raspi');
var Sensor     = require('../models/sensor');
var SensorData = require('../models/sensorData');

exports.index = function(request, response) {
  Raspi.findById(request.params.raspi_id, function(error, raspi) {
    if (error) {
      response.send(error)
    } else {
      var sensorId = raspi.sensors.find(function(sensorId) {
        return sensorId == request.params.sensor_id;
      });
      if (sensorId != undefined) {
        Sensor.findById(request.params.sensor_id, function(error, sensor) {
          if (error) {
            response.send(error);
          } else {
            sensor.populate('sensorData', function(error, sensor) {
              response.send(sensor);
            });
          }
        })
      } else {
        response.json({ message: 'No hay un sensor con ese ID en la raspi'});
      }
    }
  });
};

exports.create = function(io) {
  return function(request, response) {
    var sensorData = new SensorData();
    var sensorId   = request.params.sensor_id;
    sensorData.value = request.body.value;
    sensorData.sentAt = request.body.sentAt;
    sensorData.save(function(error, sensorData) {
      if (error) {
        response.send(error);
      } else {
        Sensor.findById(request.params.sensor_id, function(error, sensor) {
          sensor.sensorData.push(sensorData);
          sensor.save(function(error) {
            if (error) {
              response.send(error);
            } else {
              response.json({ message: 'Datos creados satisfactoriamente' });
              io.emit(sensorId, { data: [sensorData.value, sensorData.sentAt] });
            }
          });
        });
      }
    });
  };
};
