const User = require("../../../models/User");
const Room = require("../../../models/Room");
const Topic = require("../../../models/Topic");

const CDN = (process.env.TURBO_ENV == 'dev') ? '' : process.env.TURBO_CDN;

module.exports = (req, res) => {
	const slug = req.params.slug; // room slug
	const topicSlug = req.params.topicSlug; // topic slug

  let config = {
    cdn: CDN,
    room: slug,
		topicSlug: topicSlug,
    pageTitle: undefined
  }

	if(req.session == null || req.session.user == null) {
		//redirect if not logged in
		res.redirect('/');
	} else {
		//if someone is logged in, pass the username into the config variable
		User.findById(req.session.user.id)
			.then(data => {
				config['user'] = data;

				return Room.find({subscribers: data.id}); //get all rooms
			})
			.then(rooms => {
				config['rooms'] = rooms;

				// get the room that is being fetched on the page params
				return Room.find({
	        slug: slug
	      })
	    })
	    .then(rooms => {
	      if(rooms.length > 0) {
	        //if found within the database, get the topic info

	        return Topic.find({slug: topicSlug})
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
	        //if found within the database, get the topic info

					config['pageTitle'] = topics[0].room.name + ' > Editing ' + topics[0].title;
					config['topic'] = topics[0];

					// if the writer is not the current logged in user, send his ass out
	        if(req.session.user.id != topics[0].user.id) {
	          res.redirect('/');
	        } else {
						// FINALLY RENDER ROOM
		        res.render('edittopic', config)
					}
	      } else if(topics.length === 0) {
	        //if there are no results, tell client the topic was not found
	        res.json({
	          confirmation: 'fail',
	          data: 'Topic not found: ' + slug
	        })
	      }
			})
			.catch(err => {
				config['pageTitle'] = err.message;
				res.render('edittopic', config);
			})
	}
}
