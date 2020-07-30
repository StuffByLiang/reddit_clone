const User = require("../../../models/User");
const Room = require("../../../models/Room");

const CDN = (process.env.TURBO_ENV == 'dev') ? '' : process.env.TURBO_CDN;

module.exports = (req, res) => {
	const slug = req.params.slug;

  let config = {
    cdn: CDN,
    room: slug,
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
	        //if found within the database, render the room

					config['pageTitle'] = rooms[0].category + ' > Add A Topic';

	        res.render('addtopic', config)
	      } else if(rooms.length === 0) {
	        //if there are no results, tell client the room was not found
	        res.json({
	          confirmation: 'fail',
	          data: 'Room not found: ' + slug
	        })
	      }
			})
			.catch(err => {
				res.render('addtopic', config);
			})
	}
}
