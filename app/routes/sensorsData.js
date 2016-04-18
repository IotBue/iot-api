var express               = require('express');
var router                = express.Router();
var sensorsDataController = require('../controllers/sensorsData');

module.exports = function(io) {
  // GET /raspis/:raspi_id/sensors/:sensor_id
  router.get('/raspis/:raspi_id/sensors/:sensor_id', sensorsDataController.index);

  // POST /raspis/:raspi_id/sensors/:sensor_id/sensors_data
  router.post('/raspis/:raspi_id/sensors/:sensor_id/sensors_data', sensorsDataController.create(io));

  return router;
};

