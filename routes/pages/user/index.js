const helpers = require('../../helpers');
const User = require('../../../models/User');

const CDN = (process.env.TURBO_ENV == 'dev') ? '' : process.env.TURBO_CDN;

module.exports = (req, res) => {
  const user = req.params.user;

	config = {
		cdn: CDN,
		pageTitle: 'User'
	};

  User.find({
    username: user
  })
    .then(users => {
      config.userInfo = users[0];

      config.pageTitle = 'User > ' + users[0].username;

      // check if this profile is the current logged in user
      if(req.session.user!=null)
        if(req.session.user.id === users[0].id) {
          // the logged in user is the same as this profile!
          config.editable = true;
        } else {
          // logged in user is not the same!
        }

      helpers.displayPage(req, res, 'user', config);
    })
    .catch(err => {
      res.json({
        confirmation: 'fail',
        message: err.message
      })
    })

}
