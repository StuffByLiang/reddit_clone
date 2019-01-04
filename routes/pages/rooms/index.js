const turbo = require('turbo360')({site_id: process.env.TURBO_APP_ID})
const helpers = require('../../helpers');

const CDN = (process.env.TURBO_ENV == 'dev') ? '' : process.env.TURBO_CDN;

module.exports = (req, res) => {

	if(req.vertexSession == null || req.vertexSession.user == null) {
		//redirect to home if not logged in
		res.redirect('/');
		return;
	}

	config = {
		cdn: CDN,
		pageTitle: 'All Rooms'
	};

  turbo.fetch('room', null)
    .then(rooms => {
      config.rooms = rooms;

      helpers.displayPage(req, res, 'rooms', config);
    })
    .catch(err => {
      res.json({
        confirmation: 'fail',
        message: err.message
      })
    })

}
