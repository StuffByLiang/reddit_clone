const ta = require('time-ago');
const User = require('../../../../../models/User');
const Room = require('../../../../../models/Room');
const Topic = require('../../../../../models/Topic');


//fetch from database room with slug that matches the paramater 'slug'
module.exports = function(req, res, config, slug) {
  User.findById(req.session.user.id)
    .then(data => {
      config['user'] = data;

      // get all the rooms that the user is subsrcibed to
      return Room.find({
        subscribers: data.id
      });
    })
    .then(rooms => {
      config['rooms'] = rooms

      // get all the topics from the room
      return Topic.find({'room.slug': slug}).sort({'timestamp': 'desc'}).lean()
    })
    .then(topics => {
      config['topics'] = topics;

      // convert date time into FORMAT ___ units ago
      for(topic of config.topics) {
        topic.timestamp = ta.ago(topic.timestamp);
      }

      // get the room that is being fetched on the page params
      return Room.find({
        slug: slug
      })
    })
    .then(data => {
      if(data.length > 0) {
        //if found within the database, render the room
        config['pageTitle'] = data[0].category;
        config.roomDetails = {
          name: data[0].category,
          slug: data[0].slug,
          description: data[0].description,
          subscribers: data[0].subscribers.length
        }
        res.render('room', config)
      } else if(data.length === 0) {
        //if there are no results, tell client the room was not found
        res.json({
          confirmation: 'fail',
          data: 'Room not found: ' + slug
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
