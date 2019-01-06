const turbo = require('turbo360')({site_id: process.env.TURBO_APP_ID})
const helpers = require('../../helpers');

const CDN = (process.env.TURBO_ENV == 'dev') ? '' : process.env.TURBO_CDN;

module.exports = (req, res) => {
	
	config = {
		cdn: CDN,
		pageTitle: 'All Rooms'
	};

  turbo.fetch('room', null)
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
