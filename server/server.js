// When you configure SocketIO, you have access to the socket library @ http://localhost:3000/socket.io/socket.io.js
// That contains all the code that we need for the client to make the connection and to transfer data (client-server || server-client)
// By loading the socket library to the html page (Scripts), the browser will have access to all sorts of methods available

const path = require('path');
const http = require('http');
const express = require('express'); // BTS: express is using a built-in node module called HTTP to create a server
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');
// console.log(__dirname + '/../public'); // Old way
// console.log(publicPath);
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);

// Web Sockets Server
var io = socketIO(server);

app.use(express.static(publicPath));

// io.on() lets you register an event listener (listen for specific event and doe something when it happens)
// Web Sockets are PERSISTENT technology (client-server both keep the communication channel opened for as long as they want to)
// Client socket will try to reconnect if server goes down
// Connection - built-in events
io.on('connection', (socket) => {
  console.log('New user connected');

  socket.on('disconnect', () => {
    console.log('User was disconnected');
  });
});

// App.listen() method is calling http.createServer()
server.listen(port, () => {
  console.log(`Server is up on port ${port}`)
});
