var express    = require('express');
var router     = express.Router();
var Raspi      = require('../models/raspi');
var Sensor     = require('../models/sensor');
var SensorData = require('../models/sensorData');

module.exports = function(io) {

  // POST /api/raspis
  router.post('/raspis', function(request, response) {
    raspi = new Raspi();
    raspi.model = request.body.model;
    raspi.active = request.body.active;
    raspi.save(function(error, raspi) {
      if (error) {
        response.send(error);
      } else {
        response.json({ message: 'Raspi creada satisfactoriamente!', raspi: raspi });
      }
    });
  });

  // GET /api/raspis
  router.get('/raspis', function(request, response) {
    Raspi.find(function(error, raspis){
      if (error) {
        response.send(error);
      } else {
        response.send(raspis.map(function(raspi) {
          return { 
            id: raspi._id,
            model: raspi.model, 
            active: raspi.active,
            sensors: raspi.sensors.length
          }
        }));
      } 
    });
  });

  // GET /api/:raspi_id/sensors
  router.get('/raspis/:raspi_id/sensors', function(request, response) {
    Raspi.findById(request.params.raspi_id, function(error, raspi) {
      if (error) {
        response.send(error);
      } else {
        raspi.populate('sensors', function(error, raspi) {
          response.send(raspi);
        });
      }
    });
  });

  // POST /raspis/:raspi_id/sensors
  router.post('/raspis/:raspi_id/sensors', function(request, response) {
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
  });

  // GET /raspis/:raspi_id/sensors/:sensor_id
  router.get('/raspis/:raspi_id/sensors/:sensor_id', function(request, response) {
    Raspi.findById(request.params.raspi_id, function(error, raspi) {
      if (error) {
        response.send(error)
      } else {
        var sensorId = raspi.sensors.find(function(sensorId){
          return sensorId == request.params.sensor_id;
        });
        if (sensorId != undefined) {
          Sensor.findById(request.params.sensor_id, function(error, sensor){
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
  });

  // POST /raspis/:raspi_id/sensors/:sensor_id/sensors_data
  router.post('/raspis/:raspi_id/sensors/:sensor_id/sensors_data', function(request, response) {
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
  });

  return router;
};
