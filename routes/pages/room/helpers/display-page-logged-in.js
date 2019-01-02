const turbo = require('turbo360')({site_id: process.env.TURBO_APP_ID})

//fetch from database room with category that matches the paramater 'category'
module.exports = function(req, res, config, category) {
  turbo.fetchOne('user', req.vertexSession.user.id)
    .then(data => {
      config['user'] = data;

      // get all the rooms that the user is subsrcibed to
      return turbo.fetch('room', {
        subscribers: data.id
      });
    })
    .then(rooms => {
      config['rooms'] = rooms

      // get the room that is being fetched on the page params
      return turbo.fetch('room', {
        category: category
      })
    })
    .then(data => {
      if(data.length > 0) {
        //if found within the database, render the room
        res.render('room', config)
      } else if(data.length === 0) {
        //if there are no results, tell client the room was not found
        res.json({
          confirmation: 'fail',
          data: 'Room not found: ' + category
        })
      }
    })
    .catch(err => {
      res.json({
        confirmation: 'fail',
        data: err.message
      })
    })
}
