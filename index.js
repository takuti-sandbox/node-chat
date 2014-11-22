var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.get('/style.css', function(req, res) {
  res.sendFile(__dirname + '/style.css');
});

io.on('connection', function(socket) {
  socket.on('enter', function(name) {
    socket.name = name;
    socket.broadcast.emit('chat message', '--- ' + name + ' entered');
  });
  socket.on('disconnect', function() {
    socket.broadcast.emit('chat message', '--- ' + socket.name + ' quit');
  });
  socket.on('chat message', function(msg) {
    socket.broadcast.emit('chat message', socket.name + '> ' + msg);
  });
  socket.on('typing', function(is_typing) {
    socket.broadcast.emit('typing', socket.name, is_typing);
  });
});

http.listen(3000, function() {
  console.log('listening on *:3000 ...');
});
