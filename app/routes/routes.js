var express               = require('express');
var router                = express.Router();
var raspisController      = require('../controllers/raspis');
var sensorsController     = require('../controllers/sensors');
var sensorsDataController = require('../controllers/sensorsData');

module.exports = function(io) {
  router.use(require('./raspis'));
  router.use(require('./sensors'));
  router.use(require('./sensorsData')(io));

  return router;
};
