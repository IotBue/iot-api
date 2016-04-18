var express    = require('express');
var app        = express();
var server     = require('http').Server(app);
var cors       = require('cors');
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');
var io         = require('socket.io')(server);
//mongoose.connect('mongodb://localhost/raspberry-api-dev');
mongoose.connect('mongodb://raspi:raspi@ds011261.mlab.com:11261/iot-raspi-db');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var routes = require('./app/routes/routes')(io);
app.use('/api', routes);

server.listen(process.env.PORT || 8080, function() {
  console.log("UP!");
});

io.on('connection', function(socket) {
  console.log('User ' + socket.id + ' connected at ' + Date.now());
  socket.on('disconnect', function() {
    console.log('User disconnected at ' + Date.now());
  });
});
