const turbo = require('turbo360')({site_id: process.env.TURBO_APP_ID})
const helpers = require('../../helpers');

const CDN = (process.env.TURBO_ENV == 'dev') ? '' : process.env.TURBO_CDN;

module.exports = (req, res) => {
  const user = req.params.user;

	config = {
		cdn: CDN,
		pageTitle: 'User'
	};

  turbo.fetch('user', {
    username: user
  })
    .then(users => {
      config.userInfo = users[0];

      config.pageTitle = 'User > ' + users[0].username;

      // check if this profile is the current logged in user
      if(req.vertexSession.user.id === users[0].id) {
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
