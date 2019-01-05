const turbo = require('turbo360')({site_id: process.env.TURBO_APP_ID})

const chat = require('./chat')

module.exports = function (server, req) {
  const io = require('socket.io').listen(server);

  // webSocket
  io.on('connection', function(socket){
    turbo.fetchOne('user', req.vertexSession.user.id)
      .then(user => {
        console.log(`user ${user.username} connected`);
      })
      .catch(data => {
        console.log(data)
      })

    socket.on('disconnect', function(){
      console.log('user disconnected');
    });

    chat(io, socket, req);

  });
}
