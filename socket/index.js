const chat = require('./chat');
const User = require('../models/User');

let currentUsers = {

};

module.exports = function (server) {
  const io = require('socket.io').listen(server);

  // webSocket
  io.on('connection', function(socket){
    let added = false;

    socket.on('add user', username => {
      // if user was not added yet
      if(!added) {
        User.find({
          username: username
        }).lean()
          .then(users => {
            socket.username = users[0].username;
            console.log(`${users[0].username} connected`);

            // check if connected already
            if(!currentUsers.hasOwnProperty(users[0].username)) {
              // not connected
              currentUsers[users[0].username] = 1;

              // tell everyone a new user has joined
              socket.broadcast.emit('user joined', {
                username: socket.username
              });

            } else {
              // already connected

              // HACK-FIXING A bug
              let numUsers = 0;
              for(let i in currentUsers) {
                numUsers += currentUsers[i];
              }

              if(io.engine.clientsCount > numUsers)
                currentUsers[users[0].username]++;
              else
                console.log('BUG FUCKING FIXED')
            }

            // emit back to client that they are connected!
            socket.emit('connected', currentUsers)
            added = true;

            // make them join a socket room with the name of their username
            socket.join(socket.username);

            // console.log(currentUsers)
            // console.log('connect ' + io.engine.clientsCount)

          })
          .catch(data => {
            console.log(data)
          })
        }
    })

    socket.on('disconnect', function(){
      if(added) {
        currentUsers[socket.username]--;

        if(currentUsers[socket.username] == 0) {
          // if there are 0 instances of the user, delete it from the object
          delete currentUsers[socket.username]

          // tell everyone the user has left
          socket.broadcast.emit('user left', {
            username: socket.username
          });

        }

        // console.log(currentUsers)

        console.log(`${socket.username} disconnected`);
      }
      // console.log('disconnect ' + io.engine.clientsCount)
    });

    socket.on('message', function(data){
      console.log(`${socket.username} sent ${data.message} to ${data.username}`)
      socket.to(data.username).emit('message', {
        username: socket.username,
        message: data.message
      }) // send the chat to the user!!


    });

    chat(io, socket);

  });
}
