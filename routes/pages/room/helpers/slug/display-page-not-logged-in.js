const turbo = require('turbo360')({site_id: process.env.TURBO_APP_ID})

const ta = require('time-ago')

//fetch from database room with slug that matches the paramater 'slug'
module.exports = function(req, res, config, slug) {
  turbo.fetch('topic', {'room.slug': slug})
    .then(topics => {
      config['topics'] = topics;

      // convert date time into FORMAT ___ units ago
			for(topic of config.topics) {
				topic.timestamp = ta.ago(topic.timestamp);
			}

      // get the room that is being fetched on the page params
      return turbo.fetch('room', {
        slug: slug
      })
    })
    .then(data => {
      if(data.length > 0) {
        //if found within the database, render the room
        config['pageTitle'] = data[0].category;
        config.roomDetails = {
          name: data[0].category,
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
