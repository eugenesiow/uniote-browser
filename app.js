var app = require('http').createServer(handler), 
    io = require('socket.io').listen(app),
    fs = require('fs'),
    zmq  = require('zmq'), 
    receiver = zmq.socket('pull');

app.listen(8080);

function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }
 
    res.writeHead(200);
    res.end(data);
  });
}

io.sockets.on('connection', function (socket) {
  receiver.on('message', function(message) {
    var messageObj = JSON.parse(message.toString());
    var sensorName = messageObj.sensor.substr(messageObj.sensor.lastIndexOf('/') + 1);
    socket.emit(sensorName, message.toString());
  });
});
 
receiver.connect("tcp://192.168.0.100:6000");