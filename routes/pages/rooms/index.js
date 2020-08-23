const helpers = require('../../helpers');
const Room = require('../../../models/Room');

const CDN = '';

module.exports = (req, res) => {
	
	config = {
		cdn: CDN,
		pageTitle: 'All Rooms'
	};

  Room.find({})
    .then(rooms => {
      config.allRooms = rooms;

      helpers.displayPage(req, res, 'rooms', config);
    })
    .catch(err => {
      res.json({
        confirmation: 'fail',
        message: err.message
      })
    })

}
