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

// io.on() & socket.on() lets you register an event listener (listen for specific event and do something when it happens)
// Web Sockets are PERSISTENT technology (client-server both keep the communication channel opened for as long as they want to)
// Client socket will try to reconnect if server goes down
// Connection - built-in events
io.on('connection', (socket) => {
  console.log('New user connected');

  // Emit: opposite of listener (create event)
  // 2 arguments: Event, event data
  // socket.emit('newEmail', {
  //   from: 'mike@example.com',
  //   text: 'Hey. What is going on?',
  //   createdAt: 123
  // });

  // socket.on('createEmail', (newEmail) => {
  //   console.log('createEmail', newEmail);
  // });

  // socket.emit('newMessage', {
  //   from: 'John',
  //   text: 'See you then!',
  //   createdAt: 123123
  // });

  // socket.emit from Admin text Welcome to the chat app
  socket.emit('newMessage', {
    from: 'Admin',
    text: 'Welcome to the chat app',
    createdAt: new Date().getTime()
  });

  // socket.broadcast.emit from Admin text New user joined
  socket.broadcast.emit('newMessage', {
    from: 'Admin',
    text: 'New user joined',
    createdAt: new Date().getTime()
  });

  socket.on('createMessage', (message) => {
    console.log('createMessage', message);

    // Socket.emit emits an event to a single connection
    // Io.emit emits an event to EVERY single connection including the current user
    io.emit('newMessage', {
      from: message.from,
      text: message.text,
      createdAt: new Date().getTime()
    });

    // To broadcast, we have to specify individual socket
    // This let the socketIO library know which user shouldn't get the event
    // Broadcast.emit will send the event to everyone else except this user
    // socket.broadcast.emit('newMessage', {
    //   from: message.from,
    //   text: message.text,
    //   createdAt: new Date().getTime()
    // });
  });

  socket.on('disconnect', () => {
    console.log('User was disconnected');
  });
});

// App.listen() method is calling http.createServer()
server.listen(port, () => {
  console.log(`Server is up on port ${port}`)
});
