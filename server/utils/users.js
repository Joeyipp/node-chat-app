[{
  id: '',
  name: '',
  room: ''
}]

// addUser(id, name, room)
// removeUser(id)
// getUser(id)
// getUserList(room)

class Users {
  constructor () {
    this.users = [];
  }

  addUser (id, name, room) {
    var user = {id, name, room};
    this.users.push(user);
    return user;
  }

  removeUser (id) {
    var user =  this.getUser(id);

    // return user that was removed
    if (user) {
      this.users = this.users.filter((user) => user.id !== id);
    }

    return user;
  }

  getUser (id) {
    return this.users.filter((user) => user.id === id)[0];
  }

  getUserList (room) {
    var users = this.users.filter((user) => user.room === room);
    var namesArray = users.map((user) => user.name); // map returns the value we want to use

    return namesArray;
  }
};

module.exports = {Users};

// ES6 Classes
// class Person {
//   // Constructor Function
//   constructor (name, age) {
//     // this refers to the instance
//     this.name = name;
//     this.age = age;
//   }
//
//   getUserDescription () {
//     return `${this.name} is ${this.age} year(s) old.`;
//   }
// }
//
// var me = new Person('Andrew', 25);
// console.log('this.name', me.name);
// console.log('this.age', me.age);
//
// var description = me.getUserDescription();
// console.log(description);
