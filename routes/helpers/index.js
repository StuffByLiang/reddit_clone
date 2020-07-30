const User = require('../../models/User');
const Room = require('../../models/Room');

module.exports = {
  displayPage: function(req, res, page, config) {
    if(req.session == null || req.session.user == null) {
  		//render the regular page if no one is logged in
  		res.render(page, config);
  	} else {
  		//if someone is logged in, pass the username into the config variable
  		User.findById(req.session.user.id)
  			.then(data => {
  				config['user'] = data;

  				return Room.find({subscribers: data.id}); //get all rooms
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
