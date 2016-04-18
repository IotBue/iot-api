var express           = require('express');
var router            = express.Router();
var sensorsController = require('../controllers/sensors');

// POST /raspis/:raspi_id/sensors
router.post('/raspis/:raspi_id/sensors', sensorsController.create);

// GET /api/:raspi_id/sensors
router.get('/raspis/:raspi_id/sensors', sensorsController.index);

module.exports = router;
