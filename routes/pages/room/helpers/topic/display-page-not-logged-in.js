const turbo = require('turbo360')({site_id: process.env.TURBO_APP_ID})

//fetch from database room with slug that matches the paramater 'slug'
module.exports = function(req, res, config, slug, topicSlug) {

      // get the room that is being fetched on the page params
    turbo.fetch('room', {
      slug: slug
    })
    .then(rooms => {
      if(rooms.length > 0) {
        //if found within the database, continue on

        // get the topic from the room
        return turbo.fetch('topic', {slug: topicSlug})

      } else if(rooms.length === 0) {
        //if there are no results, tell client the room was not found
        res.json({
          confirmation: 'fail',
          data: 'Room not found: ' + slug
        })
      }
    })
    .then(topics => {
      if(topics.length > 0) {
        //if found within the database, render the room
        config['topic'] = topics[0];
        config['pageTitle'] = topics[0].room.name + " > " + topics[0].title;

        res.render('topic', config)
      } else if(topics.length === 0) {
        //if there are no results, tell client the room was not found
        res.json({
          confirmation: 'fail',
          data: 'Topic not found: ' + slug
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
