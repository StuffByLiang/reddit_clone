const turbo = require('turbo360')({site_id: process.env.TURBO_APP_ID})

const CDN = (process.env.TURBO_ENV == 'dev') ? '' : process.env.TURBO_CDN;


module.exports = (req, res) => {
	const category = req.params.category;

  let config = {
    cdn: CDN,
    room: category,
    pageTitle: category
  }

  if(req.vertexSession == null || req.vertexSession.user == null) {
    // if no one is logged in, display page with no user data
    require('./helpers/display-page-not-logged-in')(req, res, config, category);
  } else {
    // someone is logged in!
    require('./helpers/display-page-logged-in')(req, res, config, category);
  }
}
