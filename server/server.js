// When you configure SocketIO, you have access to the socket library @ http://localhost:3000/socket.io/socket.io.js
// That contains all the code that we need for the client to make the connection and to transfer data (client-server || server-client)
// By loading the socket library to the html page (Scripts), the browser will have access to all sorts of methods available

// Features List
// Make room names case-insensitive
// Make username unique
// Add a list of currently active chat rooms in the main page (select drop-down)

const path = require('path');
const http = require('http');
const express = require('express'); // BTS: express is using a built-in node module called HTTP to create a server
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');

const publicPath = path.join(__dirname, '../public');
// console.log(__dirname + '/../public'); // Old way
// console.log(publicPath);
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);

// Web Sockets Server
var io = socketIO(server);
var users = new Users();

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
  // socket.emit('newMessage', {
  //   from: 'Admin',
  //   text: 'Welcome to the chat app',
  //   createdAt: new Date().getTime()
  // });

  socket.on('join', (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      return callback('Name and room name are required.');
    }

    // Join people in the same room
    socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);
    // socket.leave(params.room);

    io.to(params.room).emit('updateUserList', users.getUserList(params.room));

    // io.emit emits to every single connected user
    // io.to(params.room).emit emit message to everyone connected to the room
    // socket.broadcast.emit sends message to everyone connected to the socket server except for the current user
    // socket.broadcast.to(params.room).emit emit mesasge to everyone connected to the room except for the current user
    // socket.emit emits message to specifically one user

    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
    socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined.`));
    callback();
  });

  socket.on('createMessage', (message, callback) => {
    // console.log('createMessage', message);
    var user = users.getUser(socket.id);

    if (user && isRealString(message.text)) {
      io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
    }
    // Socket.emit emits an event to a single connection
    // Io.emit emits an event to EVERY single connection including the current user

    callback();
    // To broadcast, we have to specify individual socket
    // This let the socketIO library know which user shouldn't get the event
    // Broadcast.emit will send the event to everyone else except this user
    // socket.broadcast.emit('newMessage', {
    //   from: message.from,
    //   text: message.text,
    //   createdAt: new Date().getTime()
    // });
  });

  socket.on('createLocationMessage', (coords) => {
    var user = users.getUser(socket.id);

    if (user) {
      io.to(user.room).emit('newLocationMessage', generateMessage(user.name, coords.latitude, coords.longitude));
    }
  });

  socket.on('disconnect', () => {
    // console.log('User was disconnected');
    var user = users.removeUser(socket.id);

    if (user) {
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left.`));
    }
  });
});

// App.listen() method is calling http.createServer()
server.listen(port, () => {
  console.log(`Server is up on port ${port}`)
});
