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
    // if no one is logged in, display page with no user data
    require('./helpers/slug/display-page-not-logged-in')(req, res, config, slug);
  } else {
    // someone is logged in!
    require('./helpers/slug/display-page-logged-in')(req, res, config, slug);
  }
}
