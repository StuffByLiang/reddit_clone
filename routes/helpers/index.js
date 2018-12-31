const turbo = require('turbo360')({site_id: process.env.TURBO_APP_ID})

module.exports = {
  displayPage: function(req, res, page, config) {
    if(req.vertexSession == null || req.vertexSession.user == null) {
  		//render the regular page if no one is logged in
  		res.render(page, config);
  	} else {
  		//if someone is logged in, pass the username into the config variable
  		turbo.fetchOne('user', req.vertexSession.user.id)
  			.then(data => {
  				config['user'] = data;

  				return turbo.fetch('room', {subscribers: data.id}); //get all rooms
  			})
  			.then(rooms => {
  				config['rooms'] = rooms;
  				res.render(page, config);
  			})
  			.catch(err => {
  				res.render(page, config);
  			})
  	}
  }
}
