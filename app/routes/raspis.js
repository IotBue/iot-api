var express          = require('express');
var router           = express.Router();
var raspisController = require('../controllers/raspis');

// POST /api/raspis
router.post('/raspis', raspisController.create);

// GET /api/raspis
router.get('/raspis', raspisController.index);

module.exports = router;
