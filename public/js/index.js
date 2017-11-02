// io() is a method from socketJS
// Initiating a request from the client to the server to open up a web socket and keep tat connection open
// Creates a connection - listen/ send data (events)
// Example email app: Server emits new email event, client listen for that event
// ES6 functions on front-end only works on certain browser
var socket = io();

// 2 arguments: Event name, callback function
// Connect and disconnect are built-in events
socket.on('connect', function () {
  console.log('Connected to server');

  // Client-side script that connect the server & emit event
  // socket.emit('createEmail', {
  //   to: 'jen@example.com',
  //   text: 'Hey. This is Andrew.'
  // });

  // socket.emit('createMessage', {
  //   from: 'Andrew',
  //   text: 'Yup, that works for me.'
  // });
});

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

// Render using jQuery, React
// Custom event
// socket.on('newEmail', function (email) {
//   console.log('New email', email);
// });

socket.on('newMessage', function (message) {
  console.log('newMessage', message);
});
