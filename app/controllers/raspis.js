var Raspi   = require('../models/raspi');
var exports = module.exports;

exports.create = function(request, response) {
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
};

exports.index = function(request, response) {
  Raspi.find(function(error, raspis) {
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
};

