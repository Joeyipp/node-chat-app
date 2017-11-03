// Jan 1st 1970 00:00:00 am (UTC) 0:00
// -1000 (-1 second from Jan 1st 1970)
// Timestamp stored in millisecond in JS

// var date = new Date();
// console.log(date.getMonth());

var moment = require('moment');

// Creates a new moment object that represents this current point of time
var date = moment();
date.add(100, 'year').subtract(10, 'months');
console.log(date.format('MMM Do, YYYY'));

// 10:35 am
var unixTime = new Date().getTime();
var someTimestamp = moment().valueOf();
console.log(unixTime);
console.log(someTimestamp);

var createdAt = 1234;
var date = moment(someTimestamp);
console.log(date.format('h:mm a'))
