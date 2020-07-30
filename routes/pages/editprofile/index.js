const helpers = require('../../helpers');
const User = require('../../../models/User');

const CDN = (process.env.TURBO_ENV == 'dev') ? '' : process.env.TURBO_CDN;

module.exports = (req, res) => {

	if(req.session == null || req.session.user == null) {
		//redirect to home if not logged in
		res.redirect('/');
		return;
	}

	config = {
		cdn: CDN,
		pageTitle: 'Edit your profile'
	};

  User.findById(req.session.user.id)
    .then(user => {
      config.userInfo = user;

      helpers.displayPage(req, res, 'editprofile', config);
    })
    .catch(err => {
      res.json({
        confirmation: 'fail',
        message: err.message
      })
    })

}
