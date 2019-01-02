const turbo = require('turbo360')({site_id: process.env.TURBO_APP_ID})

const CDN = (process.env.TURBO_ENV == 'dev') ? '' : process.env.TURBO_CDN;

// path : room/:slug/topic/:topicSlug
module.exports = (req, res) => {
	const slug = req.params.slug; // room slug
  const topicSlug = req.params.topic;

  let config = {
    cdn: CDN,
    room: slug,
    topicSlug: topicSlug,
    pageTitle: undefined
  }

	if(req.vertexSession == null || req.vertexSession.user == null) {
    // if no one is logged in, display page with no user data
    require('./helpers/topic/display-page-not-logged-in')(req, res, config, slug, topicSlug);
  } else {
    // someone is logged in!
    require('./helpers/topic/display-page-logged-in')(req, res, config, slug, topicSlug);
  }
}
