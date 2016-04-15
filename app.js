var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');

mongoose.connect('mongodb://localhost/raspberry-api-dev');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

var routes = require('./app/routes/routes');
app.use('/api', routes);

app.listen(port);
console.log('UP!');


