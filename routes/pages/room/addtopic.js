const turbo = require('turbo360')({site_id: process.env.TURBO_APP_ID})

const CDN = (process.env.TURBO_ENV == 'dev') ? '' : process.env.TURBO_CDN;


module.exports = (req, res) => {
	const slug = req.params.slug;

  let config = {
    cdn: CDN,
    room: slug,
    pageTitle: undefined
  }

	if(req.vertexSession == null || req.vertexSession.user == null) {
		//redirect if not logged in
		res.redirect('/');
	} else {
		//if someone is logged in, pass the username into the config variable
		turbo.fetchOne('user', req.vertexSession.user.id)
			.then(data => {
				config['user'] = data;

				return turbo.fetch('room', {subscribers: data.id}); //get all rooms
			})
			.then(rooms => {
				config['rooms'] = rooms;

				// get the room that is being fetched on the page params
	      return turbo.fetch('room', {
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
