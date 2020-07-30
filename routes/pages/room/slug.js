const CDN = (process.env.TURBO_ENV == 'dev') ? '' : process.env.TURBO_CDN;


module.exports = (req, res) => {
	const slug = req.params.slug;

  let config = {
    cdn: CDN,
    room: slug,
    pageTitle: undefined
  }

  if(req.session == null || req.session.user == null) {
    // if no one is logged in, display page with no user data
    require('./helpers/slug/display-page-not-logged-in')(req, res, config, slug);
  } else {
    // someone is logged in!
    require('./helpers/slug/display-page-logged-in')(req, res, config, slug);
  }
}
