var express = require('express');
var router  = express.Router();
var Raspi   = require('../models/raspi');
var Sensor  = require('../models/sensor');

// POST /api/raspi
router.post('/raspis', function(request, response) {
  raspi = new Raspi();
  raspi.model = request.body.model;
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

// GET /api/sensors
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

// GET /raspis/:raspi_id/sensors/:sensor_id/sensor_data

router.get('/raspis/:raspi_id/sensors/:sensor_id/sensor_data', function(request, response) {
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
            sensor.populate('sensorData', function(error, sensor){
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

module.exports = router;
